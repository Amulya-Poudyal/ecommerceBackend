
import express from 'express';
import { getUser, updateUser, getAllUsers } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';

const router = express.Router();

router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.get('/', auth, adminCheck, getAllUsers);

export default router;
