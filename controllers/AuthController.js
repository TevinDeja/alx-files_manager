//AuthController.js
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AuthController {
    /**
     * GET /connect
     * Sign-in the user by generating an authentication token.
     */
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization || '';
        const encodedCreds = authHeader.split(' ')[1];
        if (!encodedCreds) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decodedCreds = Buffer.from(encodedCreds, 'base64').toString('ascii');
        const [email, password] = decodedCreds.split(':');

        if (!email || !password) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
        const db = dbClient.client.db(dbClient.dbName);
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email, password: hashedPassword });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24); // 24 hours

        return res.status(200).json({ token });
    }

    /**
     * GET /disconnect
     * Sign-out the user by deleting their authentication token.
     */
    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(key);
        return res.status(204).send();
    }
}

export default AuthController;
