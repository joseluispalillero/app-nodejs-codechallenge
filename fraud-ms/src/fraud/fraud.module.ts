import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { KafkaService } from './kafka.service';

@Module({
    providers: [FraudService, KafkaService],
})
export class FraudModule {
}
