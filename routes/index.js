import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// User management routes
router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// Authentication routes
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

export default router;
