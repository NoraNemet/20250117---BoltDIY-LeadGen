/*
  # CRM System Tables

  1. New Tables
    - users (core user management)
    - organizations (company/client information)
    - contacts (individual contacts within organizations)
    - leads (potential sales opportunities)
    - opportunities (qualified sales opportunities)
    - tasks (action items and follow-ups)
    - notes (interaction records)
    - activity_logs (system-wide activity tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Create necessary indexes for performance

  3. Changes
    - Create complete CRM database schema
    - Establish relationships between tables
    - Set up audit logging
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (core user management)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    annual_revenue DECIMAL(15,2),
    employee_count INTEGER,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    job_title VARCHAR(100),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    contact_id UUID REFERENCES contacts(id),
    organization_id UUID REFERENCES organizations(id),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2),
    stage VARCHAR(50),
    close_date DATE,
    probability INTEGER,
    organization_id UUID REFERENCES organizations(id),
    contact_id UUID REFERENCES contacts(id),
    lead_id UUID REFERENCES leads(id),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id),
    related_to_type VARCHAR(50),
    related_to_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    related_to_type VARCHAR(50),
    related_to_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    description TEXT,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_organization ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_contact ON leads(contact_id);
CREATE INDEX IF NOT EXISTS idx_leads_organization ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_organization ON opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_contact ON opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view organizations they created or are assigned to"
    ON organizations FOR SELECT
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM leads WHERE organization_id = organizations.id AND assigned_to = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM opportunities WHERE organization_id = organizations.id AND assigned_to = auth.uid()
        )
    );

CREATE POLICY "Users can create organizations"
    ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update organizations they created"
    ON organizations FOR UPDATE
    USING (created_by = auth.uid());

-- Contacts policies
CREATE POLICY "Users can view contacts they created or are assigned to"
    ON contacts FOR SELECT
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM leads WHERE contact_id = contacts.id AND assigned_to = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM opportunities WHERE contact_id = contacts.id AND assigned_to = auth.uid()
        )
    );

CREATE POLICY "Users can create contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update contacts they created"
    ON contacts FOR UPDATE
    USING (created_by = auth.uid());

-- Leads policies
CREATE POLICY "Users can view assigned leads"
    ON leads FOR SELECT
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can create leads"
    ON leads FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned leads"
    ON leads FOR UPDATE
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

-- Opportunities policies
CREATE POLICY "Users can view assigned opportunities"
    ON opportunities FOR SELECT
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can create opportunities"
    ON opportunities FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned opportunities"
    ON opportunities FOR UPDATE
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

-- Tasks policies
CREATE POLICY "Users can view assigned tasks"
    ON tasks FOR SELECT
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can create tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned tasks"
    ON tasks FOR UPDATE
    USING (created_by = auth.uid() OR assigned_to = auth.uid());

-- Notes policies
CREATE POLICY "Users can view notes they created"
    ON notes FOR SELECT
    USING (created_by = auth.uid());

CREATE POLICY "Users can create notes"
    ON notes FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own notes"
    ON notes FOR UPDATE
    USING (created_by = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can view activity logs they performed"
    ON activity_logs FOR SELECT
    USING (performed_by = auth.uid());

CREATE POLICY "System can create activity logs"
    ON activity_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to handle updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to log activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (
        action_type,
        entity_type,
        entity_id,
        description,
        performed_by
    )
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        CASE
            WHEN TG_OP = 'INSERT' THEN 'Created new ' || TG_TABLE_NAME
            WHEN TG_OP = 'UPDATE' THEN 'Updated ' || TG_TABLE_NAME
            WHEN TG_OP = 'DELETE' THEN 'Deleted ' || TG_TABLE_NAME
        END,
        auth.uid()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create activity logging triggers
CREATE TRIGGER log_organizations_changes
    AFTER INSERT OR UPDATE OR DELETE ON organizations
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_contacts_changes
    AFTER INSERT OR UPDATE OR DELETE ON contacts
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_leads_changes
    AFTER INSERT OR UPDATE OR DELETE ON leads
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_opportunities_changes
    AFTER INSERT OR UPDATE OR DELETE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_tasks_changes
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_activity();