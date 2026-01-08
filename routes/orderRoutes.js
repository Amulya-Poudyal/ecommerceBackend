import express from 'express';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';
import {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
} from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post('/', auth, placeOrder);
router.get('/my', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

// Admin routes
router.get('/', auth, adminCheck, getAllOrders);
router.put('/:id/status', auth, adminCheck, updateOrderStatus);

export default router;
