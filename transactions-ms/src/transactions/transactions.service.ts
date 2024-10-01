import { Body, Injectable, Logger, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { mapTransaction } from "./mapper/transaction.mapper";
import { KafkaService } from './services/kafka.service';
import { PrismaService } from "./services/prisma.service";
import { RedisService } from "./services/redis.services";
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TransactionsService implements OnModuleInit {

    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private redisService: RedisService,
        private readonly kafkaService: KafkaService,
        @InjectQueue('message-queue') private messageQueue: Queue
    ) { }

    async createTransaction(
        @Body() createTransactionInput: Prisma.TransactionCreateInput
    ) {
        // Create a new transaction in the database using Prisma
        const transaction = await this.prisma.transaction.create({
            data: createTransactionInput,
        });

        // Send the transaction data to Kafka
        await this.kafkaService.sendMessage('transaction_created', {transaction});

        this.logger.debug(`Transaction ${transaction?.id} created`);

        return mapTransaction(transaction);
    }

    async getTransactionById(id: string) {
        const cachedTransaction = await this.redisService.get(`transaction:${id}`);
        // Return cached transaction
        if (cachedTransaction) {
            this.logger.debug("cachedTransaction", cachedTransaction)
            return JSON.parse(cachedTransaction);
        }
        const mapperTransaction = await this.updateCache(id);

        return mapperTransaction;
    }

    private async updateCache(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {id},
        });
        if (!transaction) {
            throw new NotFoundException(`Transaction with id ${id} not found`);
        }
        const mapperTransaction = mapTransaction(transaction);
        await this.redisService.set(`transaction:${id}`, mapperTransaction, 3600);
        return mapperTransaction;
    }

    async updateTransaction({transactionId, status}) {
        this.logger.debug(`Update transaction ${transactionId}`);
        await this.prisma.transaction.update({
            where: {id: transactionId},
            data: {status},
        });
        await this.updateCache(transactionId);
        this.logger.debug(`Transaction ${transactionId} updated`);
    }

    async onModuleInit() {
        await this.kafkaService.subscribe('transaction_updated', async (message) => {
            this.logger.debug(`Transaction read from Kafka: ${JSON.stringify(message)}`);
            await this.messageQueue.add('processTransactionUpdate', {
                transactionId: message.transactionId,
                status: message.status,
            });
        });
    }
}