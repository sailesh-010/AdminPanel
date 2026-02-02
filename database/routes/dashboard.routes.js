import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { tenantMiddleware } from '../middleware/tenant.middleware.js';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { getCategories } from "../controllers/category.controller.js";
import { getTopProducts } from '../controllers/product.controller.js';

const router = express.Router();

// All dashboard routes require authentication and tenant validation
router.use(authMiddleware);
router.use(tenantMiddleware);

// Dashboard overview (cached)
router.get('/overview', DashboardController.getOverview);

// Sales analytics
router.get('/sales-analytics', DashboardController.getSalesAnalytics);

// Top selling products
router.get('/top-products', getTopProducts);

// Filter dashboard data by shop category
router.get('/category', getCategories);

export default router;