import { createClient } from 'redis';
import redis from 'utils';
import { promisify } from 'utils'

class RedisClient {
    constructor() {
        this.client = createClient();

        this.client.on('error', (error) => {
            console.error('Redis client not connected to the server:', error);
        });

        // this.getAsync = promisify(this.client.get).bind(this.client)
        // this.setAsync = promisify(this.client.set).bind(this.client)
        // this.delAsync = promisify(this.client.del).bind(this.client)

        await this.client.set()
        await this.client.get()
        await this.client.del()
    }


}