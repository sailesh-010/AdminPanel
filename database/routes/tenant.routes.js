import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middleware/auth.middleware.js';

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ tenant_id: req.user.user_metadata.tenant_id });
});

export default router;
