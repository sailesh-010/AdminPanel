import authRoutes from './routes/auth.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import userRoutes from './routes/user.routes.js';
import appDataRoutes from './routes/appData.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import productRoutes from './routes/product.routes.js';

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/app', appDataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);

export default app;