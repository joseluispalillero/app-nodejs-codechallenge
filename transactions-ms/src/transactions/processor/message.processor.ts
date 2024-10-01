import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TransactionsService } from '../transactions.service'; 

@Processor('message-queue')
export class MessageProcessor {

    private readonly logger = new Logger(MessageProcessor.name);

    constructor(private readonly transactionsService: TransactionsService) {}

    @Process('processTransactionUpdate')
    async handleTransactionUpdate(job: Job) {
        const { transactionId, status } = job.data;
        this.logger.debug(`Processing transaction update for ID: ${transactionId}, Status: ${status}`);
        await this.updateTransaction({ transactionId, status });
    }

    private async updateTransaction({ transactionId, status }: { transactionId: string; status: string }) {
        this.transactionsService.updateTransaction({transactionId, status});
    }
}
