const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require();


class FilesController {
    static async postUpload(req, res) {
        const token = req.headers['x-token'] || req.headers['X-Token'];
        const userId = await redisClient.get(`auth_${token}`);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type, parentId = 0, isPublic, data } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }

        if (!['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: 'Missing type' });
        }

        if (type !== 'folder' && 'data') {
            return res.status(400).json({ error: 'Missing data' });
        }


    }
};