import { Module } from '@nestjs/common';
import { TransactionsResolver } from "./transactions.resolver";
import { TransactionsService } from './transactions.service';
import { PrismaService } from "./services/prisma.service";
import { RedisService } from "./services/redis.services";
import { KafkaService } from "./services/kafka.service";
import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './processor/message.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
      limiter: {
        max: 5,    // 5 jobs
        duration: 60000, // per 1 minute (60000 ms)
      },
    }),
  ],
  providers: [PrismaService, RedisService, TransactionsService, KafkaService, TransactionsResolver, MessageProcessor],
})
export class TransactionsModule {}