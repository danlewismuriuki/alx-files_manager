import { createClient } from 'redis';
import redis from 'utils';
import { promisify } from 'utils'

class RedisClient {
    constructor() {
        this.client = createClient();

        this.client.on('error', (error) => {
            console.error('Redis client not connected to the server:', error);
        });

        this.getAsync = promisify(this.client.get).bind(this.client)
        this.setAsync = promisify(this.client.set).bind(this.client)
        this.delAsync = promisify(this.client.del).bind(this.client)
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    async set(key, value, duration) {
        await this.setAsync(key, value);
        this.client.expire(key, duration);
    }

    async del(key) {
        await this.delAsync(key);
    }

}

const redisClient = new RedisClient();
export default redisClient;