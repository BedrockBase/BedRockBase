-- BedRkBase: Supabase-compatible PostgreSQL schema
-- This file recreates the current Supabase structure locally, including schemas, tables, and extensions.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

-- User table (auth.users)
CREATE TABLE IF NOT EXISTS auth.users (
  instance_id UUID,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aud VARCHAR(255),
  role VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  encrypted_password VARCHAR(255),
  email_confirmed_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  confirmation_token VARCHAR(255),
  confirmation_sent_at TIMESTAMPTZ,
  recovery_token VARCHAR(255),
  recovery_sent_at TIMESTAMPTZ,
  email_change_token_new VARCHAR(255),
  email_change VARCHAR(255),
  email_change_sent_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  phone VARCHAR(255) UNIQUE,
  phone_confirmed_at TIMESTAMPTZ,
  phone_change VARCHAR(255) DEFAULT '',
  phone_change_token VARCHAR(255) DEFAULT '',
  phone_change_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  email_change_token_current VARCHAR(255) DEFAULT '',
  email_change_confirm_status SMALLINT DEFAULT 0,
  banned_until TIMESTAMPTZ,
  reauthentication_token VARCHAR(255) DEFAULT '',
  reauthentication_sent_at TIMESTAMPTZ,
  is_sso_user BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT FALSE
);

-- Establishment table (public.establishment)
CREATE TABLE IF NOT EXISTS public.establishment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  utm_zone SMALLINT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  utm_x DECIMAL(12,2),
  utm_y DECIMAL(12,2),
  datum TEXT DEFAULT 'WGS84',
  long_calc DECIMAL(9,6),
  lat_calc DECIMAL(9,6),
  geom geography,
  gov_id TEXT,
  local_id TEXT,
  alt_id TEXT,
  operating_permit_id TEXT,
  facility_type TEXT,
  naics_code VARCHAR(6),
  nace_code VARCHAR(8),
  sector_code TEXT,
  industry_description TEXT,
  capacity_mw DECIMAL(12,2),
  employees_total INT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  program_acronym TEXT,
  pollutant_release JSONB,
  usr_defined_01 TEXT,
  usr_defined_02 TEXT,
  usr_defined_03 TEXT,
  usr_defined_04 TEXT,
  usr_defined_05 TEXT,
  usr_defined_06 TEXT,
  usr_defined_07 TEXT,
  usr_defined_08 TEXT,
  usr_defined_09 TEXT,
  usr_defined_10 TEXT,
  usr_json_defined JSONB,
  upload TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  owner_id UUID,
  CONSTRAINT fk_establishment_owner FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE NO ACTION
);

-- Establishment access table (public.establishment_access)
CREATE TABLE IF NOT EXISTS public.establishment_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID,
  user_id UUID,
  access_level TEXT DEFAULT 'read',
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_establishment_access_establishment FOREIGN KEY (establishment_id) REFERENCES public.establishment(id) ON DELETE CASCADE,
  CONSTRAINT fk_establishment_access_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Geo points table (public.geo_points)
CREATE TABLE IF NOT EXISTS public.geo_points (
  id BIGSERIAL PRIMARY KEY,
  establishment_id UUID,
  name TEXT NOT NULL,
  point_type TEXT,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  elevation_m DECIMAL(8,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_geo_points_establishment FOREIGN KEY (establishment_id) REFERENCES public.establishment(id)
);

-- Indexes and constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_establishment_unique_ids ON public.establishment(gov_id, local_id);
CREATE INDEX IF NOT EXISTS idx_establishment_geom_gix ON public.establishment USING GIST (geom);

-- (Add more tables and constraints as needed based on the full introspected schema)

-- Optional: Add RLS policies, triggers, or additional constraints to match Supabase behavior

-- To reset the database, drop all tables and re-run this script.
