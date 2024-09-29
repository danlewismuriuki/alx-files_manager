const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');


class AppController {
    static async getStatus(req, res) {
        const isRedisAlive = redisClient.isAlive();
        const isDbAlive = dbClient.isAlive();

        return res.status(200).json({ redis: isRedisAlive, db: isDbAlive });
    };

    static async getStats(req, res) {
        const userCount = await dbClient.nbUsers();
        const filesCount = await dbClient.nbFiles();

        return res.status(200).json({ users: userCount, files: filesCount });
    }
}

export default AppController;