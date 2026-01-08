import express from 'express';
import auth from '../middleware/auth.js';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/item/:itemId', auth, updateCartItem);
router.delete('/item/:itemId', auth, removeCartItem);
router.delete('/clear', auth, clearCart);

export default router;
