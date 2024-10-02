const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require();
const { ObjectId } = require('mongodb');

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

        if (parentId !== 0) {
            const parentFile = await dbClient.filesColelction().findOne({
                _id: ObjectId(parentId), userId: ObjectId(userId)
            });
            if (!parentId) {
                return res.status(400).json({ error: 'Parent not found'});
            }
            if (parentFile.type !== 'folder') {
                return res.status(400).json({ error: 'Parent is not a Folder' })
            }
        }
        const newFile = {
            userId,
            name,
            type,
            isPublic,
            parentId: parentId === 0 ? 0 : parentId,
            createdAt: new Date(),
          };

          if (type === 'folder') {
            const result = await dbClient.filesCollection.insertOne(newFile);
            return res.status(201).json(result.)
          }

    }
};