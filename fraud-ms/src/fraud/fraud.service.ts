import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class FraudService implements OnModuleInit {
    private readonly logger = new Logger(FraudService.name);

    constructor(private readonly kafkaService: KafkaService) {}

    async checkFraud(value: number): Promise<string> {
        return value > 1000 ? 'rejected' : 'approved';
    }

    async onModuleInit() {
        // Subscribe to the 'transaction_created' topic
        await this.kafkaService.subscribe('transaction_created', async (message) => {
            const { transaction: { id, value } } = message;
            const fraudResult = await this.checkFraud(value);

            this.logger.debug(`Transaction ${id} updated to ${fraudResult}`);

            // Send fraud check result to the 'transaction_updated' topic
            await this.kafkaService.sendMessage('transaction_updated', {
                transactionId: id,
                status: fraudResult,
            });
        });
    }
}
