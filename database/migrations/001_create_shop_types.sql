-- Create shop_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS shop_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default shop types
INSERT INTO shop_types (name, description) VALUES 
    ('shoe', 'Footwear and shoe-related products'),
    ('clothes', 'Clothing and apparel products')
ON CONFLICT (name) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shop_types_name ON shop_types(name);