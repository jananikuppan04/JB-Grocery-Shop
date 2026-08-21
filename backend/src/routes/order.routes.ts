import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/order.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;
