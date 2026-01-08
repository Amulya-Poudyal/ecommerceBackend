import express from 'express';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
} from '../controllers/brandController.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/', auth, adminCheck, createBrand);
router.put('/:id', auth, adminCheck, updateBrand);
router.delete('/:id', auth, adminCheck, deleteBrand);

export default router;
