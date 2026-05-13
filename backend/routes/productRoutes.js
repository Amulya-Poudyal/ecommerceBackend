// routes/products.routes.js
import express from 'express';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { addVariant, updateVariant, deleteVariant } from '../controllers/productVariantsController.js';
import { addImage, deleteImage } from '../controllers/productImageController.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', auth, adminCheck, createProduct);
router.put('/:id', auth, adminCheck, updateProduct);
router.delete('/:id', auth, adminCheck, deleteProduct);

// Product variants
router.post('/:id/variants', auth, adminCheck, addVariant);
router.put('/:id/variants/:variantId', auth, adminCheck, updateVariant);
router.delete('/:id/variants/:variantId', auth, adminCheck, deleteVariant);

// Product images
router.post('/:id/images', auth, adminCheck, addImage);
router.delete('/:id/images/:imageId', auth, adminCheck, deleteImage);

export default router;
