-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Tenants: Users can only see their own tenant
CREATE POLICY "Users can view own tenant" ON tenants
    FOR SELECT USING (
        id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    );

-- Users: Users can only see users from their tenant
CREATE POLICY "Users can view tenant users" ON users
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    );

-- Users: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (
        id = auth.uid()
    );

-- Products: Full access within tenant
CREATE POLICY "Full access to tenant products" ON products
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    );

-- Sales: Full access within tenant
CREATE POLICY "Full access to tenant sales" ON sales
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    );

-- Force RLS for all operations
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;
ALTER TABLE sales FORCE ROW LEVEL SECURITY;


