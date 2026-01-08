// routes/auth.routes.js
import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', auth, getCurrentUser); // Protected route

export default router;
