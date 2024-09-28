import { createClient } from 'redis';
import { promisify } from 'util'

class RedisClient {
    constructor() {
        this.client = createClient();
        this.isClientConnected = true;

        this.client.on('connect', () => {
            //console.log('Redis client connected to the server');
            this.isClientConnected = true;
        });

        this.client.on('error', (error) => {
            console.error('Redis client not connected to the server:', error);
            this.isClientConnected = false;
        });

        this.client.on('end', () => {
            console.error('Redis client connection closed');
            this.isClientConnected = false;
        });

        this.getAsync = promisify(this.client.get).bind(this.client)
        this.setAsync = promisify(this.client.set).bind(this.client)
        this.delAsync = promisify(this.client.del).bind(this.client)
    }

    isAlive() {
        return this.isClientConnected;
    }

    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    async set(key, value, duration) {
        if (duration <= 0) {
            throw new Error('Duration must be a positive integer');
        }

        const success = await this.setAsync(key, value);
        if (success) {
            this.client.expire(key, duration);
        }
    }

    async del(key) {
        await this.delAsync(key);
    }

    async quit() {
        await this.client.quit();
    }

}

const redisClient = new RedisClient();
export default redisClient;