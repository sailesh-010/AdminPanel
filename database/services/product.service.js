
import { supabase } from '../config/Supabase.js';

export class ProductService {
  static async getCategories(tenantId) {
    try {
      console.log(`🔍 ProductService.getCategories called for tenant: ${tenantId}`);
      
      // Get the user's shop_type_id from their profile/tenant
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('tenants (shop_type_id)')
        .eq('id', tenantId)
        .single();

      if (userError || !userData?.tenants?.shop_type_id) {
        console.log('⚠️ Could not get shop_type_id, trying direct query');
        // Fallback: try to get all categories
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });
        
        if (error) throw error;
        const categories = data.map(c => c.name);
        console.log(`✅ Found ${categories.length} categories (fallback):`, categories);
        return categories;
      }

      const shopTypeId = userData.tenants.shop_type_id;
      console.log(`🏪 Shop Type ID: ${shopTypeId}`);

      // Fetch categories for this shop type
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('shop_type_id', shopTypeId)
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(error.message);
      }

      console.log(`✅ Found ${data.length} categories:`, data);
      
      // Extract just the category names
      const categories = data.map(c => c.name);
      return categories;
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      throw new Error('Failed to fetch categories: ' + error.message);
    }
  }

  static async addProduct(tenantId, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...productData,
            tenant_id: tenantId,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data[0];
    } catch (error) {
      throw new Error('Failed to add product: ' + error.message);
    }
  }

  static async getAllProducts(tenantId, page, limit) {
    try {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw new Error(error.message);
      }
      return { products: data, total: count };
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);
    }
  }

  static async searchProducts(tenantId, filters, page, limit) {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('tenant_id', tenantId);

      if (filters.name && filters.name.trim()) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters.category && filters.category.trim()) {
        query = query.eq('category', filters.category);
      }
      if (filters.inStock === true || filters.inStock === 'true') {
        query = query.gt('quantity', 0);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw new Error(error.message);
      }
      return { products: data, total: count };
    } catch (error) {
      throw new Error('Failed to search products: ' + error.message);
    }
  }

  static async getProductById(tenantId, id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw new Error('Failed to fetch product: ' + error.message);
    }
  }

  static async updateProduct(tenantId, id, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq('tenant_id', tenantId)
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data[0];
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message);
    }
  }

  static async deleteProduct(tenantId, id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (error) {
      throw new Error('Failed to delete product: ' + error.message);
    }
  }
}