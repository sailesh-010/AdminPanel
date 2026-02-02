import { DashboardService } from '../services/dashboard.service.js';
import { cache } from '../utils/cache.js';

export class DashboardController {
  // Get dashboard overview with caching
  static async getOverview(req, res) {
    try {
      const tenantId = req.tenant_id;
      const cacheKey = cache.generateKey(tenantId, 'overview');
      
      // Check cache first
      let overview = cache.get(cacheKey);
      
      if (!overview) {
        // Cache miss - fetch from database
        overview = await DashboardService.getOverview(tenantId);
        cache.set(cacheKey, overview);
        console.log(`🔄 Cache miss - fetched overview for tenant ${tenantId}`);
      } else {
        console.log(`⚡ Cache hit - served overview for tenant ${tenantId}`);
      }
      
      res.json({
        success: true,
        data: overview,
        cached: !!overview
      });
    } catch (error) {
      console.error('Dashboard overview error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard overview' 
      });
    }
  }

  // Get sales analytics
  static async getSalesAnalytics(req, res) {
    try {
      const tenantId = req.tenant_id;
      const days = parseInt(req.query.days) || 30;
      
      const analytics = await DashboardService.getSalesAnalytics(tenantId, days);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Sales analytics error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch sales analytics' 
      });
    }
  }
}