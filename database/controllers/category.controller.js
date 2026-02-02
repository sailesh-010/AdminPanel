import { supabase } from "../config/Supabase.js";

export const getCategories = async (req, res) => {
  try {
    const tenantId = req.tenant_id;
    
    if (!tenantId) {
      return res.status(401).json({ error: 'Unauthorized: tenant_id missing' });
    }

    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });

    if (error) {
      console.error('Category fetch error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Extract just the names
    const categories = data.map(c => c.name);
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: err.message });
  }
};