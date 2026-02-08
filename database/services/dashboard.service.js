import { supabase } from '../config/Supabase.js';

export class DashboardService {
  // Get dashboard overview metrics
  static async getOverview(tenantId) {
    try {
      // Get total products count
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      // Get total sales count
      const { count: totalSales } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      // Get total revenue and profit
      const { data: revenueData } = await supabase
        .from('sales')
        .select('total_amount, profit')
        .eq('tenant_id', tenantId);

      const totalRevenue = revenueData?.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0) || 0;
      const totalProfit = revenueData?.reduce((sum, sale) => sum + parseFloat(sale.profit), 0) || 0;

      return {
        totalProducts: totalProducts || 0,
        totalSales: totalSales || 0,
        totalRevenue: totalRevenue,
        totalProfit: totalProfit
      };
    } catch (error) {
      throw new Error('Failed to fetch dashboard overview: ' + error.message);
    }
  }

  // Get sales analytics (revenue vs profit by date)
  static async getSalesAnalytics(tenantId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data } = await supabase
        .from('sales')
        .select('sale_date, total_amount, profit')
        .eq('tenant_id', tenantId)
        .gte('sale_date', startDate.toISOString().split('T')[0])
        .order('sale_date', { ascending: true });

      // Group by date and calculate totals
      const analytics = {};
      data?.forEach(sale => {
        const date = sale.sale_date;
        if (!analytics[date]) {
          analytics[date] = { date, revenue: 0, profit: 0 };
        }
        analytics[date].revenue += parseFloat(sale.total_amount);
        analytics[date].profit += parseFloat(sale.profit);
      });

      return Object.values(analytics);
    } catch (error) {
      throw new Error('Failed to fetch sales analytics: ' + error.message);
    }
  }

  // Get top selling products
  static async getTopProducts(tenantId, limit = 5) {
    try {
      const { data } = await supabase
        .from('sales')
        .select(`
          product_id,
          products!inner(name, sku),
          total_quantity:quantity.sum(),
          total_revenue:total_amount.sum()
        `)
        .eq('tenant_id', tenantId)
        .group('product_id, products.name, products.sku')
        .order('total_quantity', { ascending: false })
        .limit(limit);

      return data?.map(item => ({
        productId: item.product_id,
        name: item.products.name,
        sku: item.products.sku,
        totalQuantity: parseInt(item.total_quantity) || 0,
        totalRevenue: parseFloat(item.total_revenue) || 0
      })) || [];
    } catch (error) {
      throw new Error('Failed to fetch top products: ' + error.message);
    }
  }
}