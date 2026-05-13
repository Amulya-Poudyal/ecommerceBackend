import express from 'express';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, adminCheck, createCategory);
router.put('/:id', auth, adminCheck, updateCategory);
router.delete('/:id', auth, adminCheck, deleteCategory);

export default router;
