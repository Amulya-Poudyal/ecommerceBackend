import express from 'express';
import auth from '../middleware/auth.js';
import {
    addReview,
    getProductReviews,
    deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);

// User
router.post('/product/:productId', auth, addReview);
router.delete('/:id', auth, deleteReview);

export default router;
