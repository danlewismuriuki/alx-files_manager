const crypto = require('node:crypto');
const dbClient = require('../utils/db');

class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // If the password is missing, return an error Missing password with a status code 400
    if (!password) {
      return res.status(400).json({ error: ' Missing password' });
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

    return res.status(201).json(newUser);
  }
}

module.exports = UserController;
