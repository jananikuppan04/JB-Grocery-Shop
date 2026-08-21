import express from 'express';
import { 
  getDashboardStats, 
  getAdminOrders, 
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventory,
  adjustInventory
} from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.use(protect, admin); // All admin routes require authentication and admin role

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/inventory', getInventory);
router.post('/inventory/adjust', adjustInventory);

export default router;
