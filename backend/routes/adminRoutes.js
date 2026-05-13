import express from 'express';
import auth from '../middleware/auth.js';
import adminCheck from '../middleware/adminCheck.js';
import {
    getAllUsers,
    updateUserRole,
    getAllOrders,
    updateOrderStatus,
    deleteReviewAdmin
} from '../controllers/adminController.js';

const router = express.Router();

router.use(auth, adminCheck); // EVERYTHING below is admin-only

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.delete('/reviews/:id', deleteReviewAdmin);

export default router;
