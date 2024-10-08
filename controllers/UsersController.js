const crypto = require('node:crypto');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        // If the password is missing, return an error Missing password with a status code 400
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const existingUser = await dbClient.usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassw = crypto.createHash('sha1').update(password).digest('hex');

        const newUser = {
            email, // shorthand
            password: hashedPassw,
        };

        const result = await dbClient.usersCollection.insertOne(newUser);
        newUser._id = result.insertedId;

        return res.status(201).json({ id: newUser._id, email: newUser.email });
    }

    static async getMe(req, res) {
        const token = req.header('X-Token');
        // console.log("Received token:", token);

        const userId = await redisClient.get(`auth_${token}`);
        // console.log("Retrieved user ID from Redis:", userId);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // const user = await dbClient.usersCollection.findOne({ _id: userId });
            const user = await dbClient.usersCollection.findOne({ _id: ObjectId(userId) });

            // console.log("Attempting to find user with ID:", userId); // 3
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.status(200).json({ id: user._id, email: user.email });
        } catch (error) {
            // console.error('Error retrieving user profile:', error);  // 4
            return res.status(500).json({ error: 'Internal Server Error ' });
        }
    }
}

module.exports = UsersController;
