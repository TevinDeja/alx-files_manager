//index.js
import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';

const router = Router();

//Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

//New route for creating users
router.post('/users', UsersController.postNew);

export default router;
