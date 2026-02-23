-- Migration: Add System Settings Table
-- Date: 2026-02-23
-- Description: Creates system_settings table for managing global application settings like chatbot enable/disable

-- ============================================
-- SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'boolean', -- 'boolean', 'string', 'number', 'json'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES 
  ('chatbot_enabled', 'true', 'boolean', 'Enable or disable the support chatbot system globally')
ON CONFLICT (setting_key) DO NOTHING;
