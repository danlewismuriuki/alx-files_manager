const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

class FilesController {
    static async postUpload(req, res) {
        const token = req.headers['x-token'] || req.headers['X-Token'];
        const userId = await redisClient.get(`auth_${token}`);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type, parentId = 0, isPublic = false, data } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }

        if (!['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: 'Missing type' });
        }

        if (type !== 'folder' && !data) {
            return res.status(400).json({ error: 'Missing data' });
        }

        if (parentId !== 0) {
            console.log(`Checking parent file with parentId: ${parentId} for userId: ${userId}`); // 1
            if (!ObjectId.isValid(parentId)) {
                return res.status(400).json({ error: 'Invalid Parent ID' });
            }

            const parentFile = await dbClient.filesCollection.findOne({
                _id: new ObjectId(parentId), userId: new ObjectId(userId)
            });

            if (!parentFile) {
                console.log(`Parent not found for parentId: ${parentId}`); // 3
                return res.status(400).json({ error: 'Parent not found' });
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
            return res.status(201).json(result.ops[0]);
        }

        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const fileUUID = uuidv4();
        const filePath = path.join(folderPath, fileUUID);

        console.log(`Saving file to: ${filePath}`); // 3
        const fileData = Buffer.from(data, 'base64');
        try {
            fs.writeFileSync(filePath, fileData);
        } catch (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        newFile.localPath = filePath;
        const result = await dbClient.filesCollection.insertOne(newFile);

        const file = result.ops[0];
        // file.id = file._id;
        // delete file._id;
        // const { _id, ...fileWithoutId } = file;
        // fileWithoutId.id = _id;

        return res.status(201).json(file);
    }
};

module.exports = FilesController;