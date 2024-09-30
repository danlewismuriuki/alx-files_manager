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
    }
};