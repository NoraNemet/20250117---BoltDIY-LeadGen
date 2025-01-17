/*
  # User Management System with RBAC

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `permissions`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `resource` (text)
      - `action` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `role_permissions`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key)
      - `permission_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `role_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `theme` (text)
      - `timezone` (text)
      - `notifications_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `ip_address` (text)
      - `user_agent` (text)
      - `last_active` (timestamp)
      - `created_at` (timestamp)

    - `audit_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `action` (text)
      - `resource` (text)
      - `details` (jsonb)
      - `ip_address` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Add audit logging triggers

  3. Changes
    - Update profiles table with additional fields
    - Add default roles and permissions
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  resource text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles ON DELETE CASCADE NOT NULL,
  permission_id uuid REFERENCES permissions ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (role_id, permission_id)
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role_id uuid REFERENCES roles ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  theme text DEFAULT 'light',
  timezone text DEFAULT 'UTC',
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  ip_address text NOT NULL,
  user_agent text,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  action text NOT NULL,
  resource text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_enabled boolean DEFAULT false;

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage roles"
  ON roles
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Users can view assigned roles"
  ON roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = roles.id
    )
  );

CREATE POLICY "Admins can manage permissions"
  ON permissions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Users can view own audit logs"
  ON audit_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Create function to log actions
CREATE OR REPLACE FUNCTION log_action()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource, details)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER log_profile_changes
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_action();

CREATE TRIGGER log_role_changes
  AFTER INSERT OR UPDATE OR DELETE ON roles
  FOR EACH ROW EXECUTE FUNCTION log_action();

CREATE TRIGGER log_permission_changes
  AFTER INSERT OR UPDATE OR DELETE ON permissions
  FOR EACH ROW EXECUTE FUNCTION log_action();

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access and user management'),
  ('manager', 'Team management and reporting capabilities'),
  ('member', 'Basic system access and task execution')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
  ('manage_users', 'Can manage all users', 'users', 'manage'),
  ('manage_roles', 'Can manage roles and permissions', 'roles', 'manage'),
  ('view_reports', 'Can view all reports', 'reports', 'view'),
  ('manage_team', 'Can manage team members', 'team', 'manage'),
  ('manage_tasks', 'Can manage tasks', 'tasks', 'manage'),
  ('view_tasks', 'Can view tasks', 'tasks', 'view')
ON CONFLICT (name) DO NOTHING;

-- Assign default permissions to roles
WITH role_ids AS (
  SELECT id, name FROM roles
),
permission_ids AS (
  SELECT id, name FROM permissions
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM role_ids r
CROSS JOIN permission_ids p
WHERE 
  (r.name = 'admin') OR
  (r.name = 'manager' AND p.name IN ('view_reports', 'manage_team', 'manage_tasks')) OR
  (r.name = 'member' AND p.name IN ('view_tasks'))
ON CONFLICT (role_id, permission_id) DO NOTHING;