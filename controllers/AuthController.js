const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');


class AuthController {
    static async getConnect(re, res) {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const base64Credentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = decodedCredentials.split(':');

        if (!email || !password) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const user = await dbClient.usersCollection.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const hashedPassw = crypto.createHash('sha1').update(password).digest('hex');
            if (hashedPassw !== user.password) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = uuidv4();

            const redisKey = `auth_${token}`;
            await redisClient.set(redisKey, user._id.toString(), 86400);

            return res.status(200).json({ token });
        } catch (error) {
            console.error('Error during authentication:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = AuthController;