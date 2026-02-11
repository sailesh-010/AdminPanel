-- Workers Table Migration
-- Run this SQL in your Supabase SQL editor

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    join_date DATE NOT NULL,
    address TEXT,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL DEFAULT 0,
    allowance DECIMAL(10,2) DEFAULT 0,
    payment_cycle VARCHAR(20) DEFAULT 'monthly',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worker_payments table for salary payment history
CREATE TABLE IF NOT EXISTS worker_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workers_tenant_id ON workers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_workers_department ON workers(tenant_id, department);
CREATE INDEX IF NOT EXISTS idx_worker_payments_tenant_id ON worker_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_worker_payments_worker_id ON worker_payments(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_payments_date ON worker_payments(payment_date);

-- Enable RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers table
CREATE POLICY "Workers are viewable by tenant users"
    ON workers FOR SELECT
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Workers are insertable by tenant users"
    ON workers FOR INSERT
    WITH CHECK (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Workers are updatable by tenant users"
    ON workers FOR UPDATE
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Workers are deletable by tenant users"
    ON workers FOR DELETE
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for worker_payments table
CREATE POLICY "Worker payments are viewable by tenant users"
    ON worker_payments FOR SELECT
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Worker payments are insertable by tenant users"
    ON worker_payments FOR INSERT
    WITH CHECK (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Worker payments are updatable by tenant users"
    ON worker_payments FOR UPDATE
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Worker payments are deletable by tenant users"
    ON worker_payments FOR DELETE
    USING (tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
    ));
