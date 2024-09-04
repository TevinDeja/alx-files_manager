import crypto from 'crypto';
import dbClient from '../utils/db.js';

class UsersController {
    /**
     * Handles POST /users
     * Creates a new user in the database
     */
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check for missing email or password
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const db = dbClient.client.db(dbClient.dbName);
        const usersCollection = db.collection('users');

        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        // Hash the password using SHA1
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        // Create and insert the new user
        const result = await usersCollection.insertOne({
            email,
            password: hashedPassword
        });

        // Return the new user with email and id
        res.status(201).json({
            id: result.insertedId,
            email
        });
    }
}

export default UsersController;

