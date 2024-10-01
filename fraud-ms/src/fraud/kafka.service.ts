import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;
    private producer: Producer;
    private readonly logger = new Logger(KafkaService.name);

    constructor() {

        this.logger.debug(`connection ${process.env.KAFKA_BROKER} `);

        this.kafka = new Kafka({
            clientId: 'fraud-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], 
        });
        this.consumer = this.kafka.consumer({ groupId: 'fraud-group' });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }

    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async subscribe(topic: string, eachMessageHandler: (message: any) => Promise<void>) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = JSON.parse(message.value.toString());
                await eachMessageHandler(value);
            },
        });
    }
}
