import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;
    private producer: Producer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'transactions-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        });
        this.consumer = this.kafka.consumer({ groupId: 'transaction-group' });
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
