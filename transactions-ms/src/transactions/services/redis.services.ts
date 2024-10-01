import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        });
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async set(key: string, value: any, ttl: number) {
        await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    }
}