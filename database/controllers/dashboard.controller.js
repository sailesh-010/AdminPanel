import { supabase } from '../config/Supabase.js';

// Get revenue by category
export const getRevenueByCategory = async (req, res, next) => {
  try {
    const db = req.db;
    const { start_date, end_date } = req.query;

    let query = `
      SELECT
        c.id,
        c.name AS category_name,
        COUNT(DISTINCT s.id) AS total_sales,
        COALESCE(SUM(s.quantity_sold), 0) AS total_quantity_sold,
        COALESCE(SUM(s.total_amount), 0) AS total_revenue,
        ROUND(COALESCE(AVG(s.total_amount), 0)::numeric, 2) AS average_sale_amount,
        MAX(s.sale_date) AS last_sale_date
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.tenant_id = '${req.tenant_id}'
      LEFT JOIN sales s ON p.id = s.product_id
    `;

    if (start_date && end_date) {
      query += ` WHERE s.sale_date >= '${start_date}' AND s.sale_date <= '${end_date}'`;
    }

    query += ` GROUP BY c.id, c.name ORDER BY total_revenue DESC`;

    const { data, error } = await db.rpc('execute_query', { query_text: query }).catch(() => {
      // Fallback: use direct query
      return db
        .from('sales')
        .select('*, products(category_id)')
        .eq('tenant_id', req.tenant_id);
    });

    if (error) {
      console.error('Error fetching revenue by category:', error);
      // Return aggregated data from sales
      const { data: sales } = await db
        .from('sales')
        .select('*, products(category_id, name)')
        .eq('tenant_id', req.tenant_id);

      const revenueMap = {};
      sales?.forEach(sale => {
        const categoryId = sale.products?.category_id;
        if (categoryId) {
          if (!revenueMap[categoryId]) {
            revenueMap[categoryId] = {
              category_id: categoryId,
              total_sales: 0,
              total_quantity_sold: 0,
              total_revenue: 0
            };
          }
          revenueMap[categoryId].total_sales += 1;
          revenueMap[categoryId].total_quantity_sold += sale.quantity_sold;
          revenueMap[categoryId].total_revenue += sale.total_amount;
        }
      });

      return res.json(Object.values(revenueMap));
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

// Get top-selling products
export const getTopSellingProducts = async (req, res, next) => {
  try {
    const db = req.db;
    const { limit = 10 } = req.query;

    const { data: sales, error: salesError } = await db
      .from('sales')
      .select('*, products(id, name, price, category_id)')
      .eq('tenant_id', req.tenant_id);

    if (salesError) {
      const dbError = new Error(salesError.message || 'Failed to fetch sales');
      dbError.status = 500;
      throw dbError;
    }

    // Aggregate sales by product
    const productMap = {};
    sales?.forEach(sale => {
      const productId = sale.product_id;
      if (!productMap[productId]) {
        productMap[productId] = {
          product_id: productId,
          product_name: sale.products?.name,
          price: sale.products?.price,
          category_id: sale.products?.category_id,
          total_sales_count: 0,
          total_quantity_sold: 0,
          total_revenue: 0
        };
      }
      productMap[productId].total_sales_count += 1;
      productMap[productId].total_quantity_sold += sale.quantity_sold;
      productMap[productId].total_revenue += sale.total_amount;
    });

    // Sort by revenue and limit
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, parseInt(limit));

    res.json(topProducts);
  } catch (err) {
    next(err);
  }
};

// Get current stock levels
export const getStockLevels = async (req, res, next) => {
  try {
    const db = req.db;

    const { data: products, error } = await db
      .from('products')
      .select('*, categories(name)')
      .eq('tenant_id', req.tenant_id)
      .order('stock_quantity', { ascending: true });

    if (error) {
      const dbError = new Error(error.message || 'Failed to fetch stock levels');
      dbError.status = 500;
      throw dbError;
    }

    // Add stock status
    const stockData = products?.map(product => ({
      ...product,
      stock_status: product.stock_quantity === 0 
        ? 'Out of Stock' 
        : product.stock_quantity <= 10 
          ? 'Low Stock' 
          : 'In Stock'
    })) || [];

    res.json(stockData);
  } catch (err) {
    next(err);
  }
};

// Get dashboard summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const db = req.db;

    // Get products
    const { data: products } = await db
      .from('products')
      .select('stock_quantity')
      .eq('tenant_id', req.tenant_id);

    // Get sales
    const { data: sales } = await db
      .from('sales')
      .select('total_amount, quantity_sold')
      .eq('tenant_id', req.tenant_id);

    const totalProducts = products?.length || 0;
    const totalStock = products?.reduce((sum, p) => sum + (p.stock_quantity || 0), 0) || 0;
    const outOfStockCount = products?.filter(p => p.stock_quantity === 0).length || 0;
    const lowStockCount = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length || 0;
    const totalSales = sales?.length || 0;
    const totalRevenue = sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
    const averageSale = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;

    res.json({
      total_products: totalProducts,
      total_stock: totalStock,
      out_of_stock_count: outOfStockCount,
      low_stock_count: lowStockCount,
      total_sales: totalSales,
      total_revenue: totalRevenue,
      average_sale: parseFloat(averageSale)
    });
  } catch (err) {
    next(err);
  }
};

// Get sales statistics
export const getSalesStatistics = async (req, res, next) => {
  try {
    const db = req.db;
    const { start_date, end_date } = req.query;

    let query = db
      .from('sales')
      .select('*')
      .eq('tenant_id', req.tenant_id);

    if (start_date) {
      query = query.gte('sale_date', start_date);
    }

    if (end_date) {
      query = query.lte('sale_date', end_date);
    }

    const { data: sales, error } = await query;

    if (error) {
      const dbError = new Error(error.message || 'Failed to fetch sales');
      dbError.status = 500;
      throw dbError;
    }

    const stats = {
      total_sales: sales?.length || 0,
      total_revenue: sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
      total_quantity_sold: sales?.reduce((sum, s) => sum + (s.quantity_sold || 0), 0) || 0,
      average_sale_amount: sales?.length > 0 
        ? (sales.reduce((sum, s) => sum + (s.total_amount || 0), 0) / sales.length).toFixed(2)
        : 0,
      average_quantity_per_sale: sales?.length > 0
        ? (sales.reduce((sum, s) => sum + (s.quantity_sold || 0), 0) / sales.length).toFixed(2)
        : 0
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
