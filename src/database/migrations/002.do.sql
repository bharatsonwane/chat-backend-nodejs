-- Insert data into lookup_type table
INSERT INTO lookup_type (name, created_at, updated_at)
VALUES
  ('role', NOW(), NOW()),
  ('userStatus', NOW(), NOW()),
  ('chatType', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 
-- Insert data into lookup table for 'role'
INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
VALUES
  ('Super Admin', (SELECT id FROM lookup_type WHERE name = 'role'), NOW(), NOW()),
  ('Admin', (SELECT id FROM lookup_type WHERE name = 'role'), NOW(), NOW()),
  ('User', (SELECT id FROM lookup_type WHERE name = 'role'), NOW(), NOW())
ON CONFLICT (lookup_type_id, label) DO NOTHING;

-- 
-- Insert data into lookup table for 'userStatus'
INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
VALUES
  ('Active', (SELECT id FROM lookup_type WHERE name = 'userStatus'), NOW(), NOW()),
  ('Deleted', (SELECT id FROM lookup_type WHERE name = 'userStatus'), NOW(), NOW()),
  ('Blocked', (SELECT id FROM lookup_type WHERE name = 'userStatus'), NOW(), NOW())
ON CONFLICT (lookup_type_id, label) DO NOTHING;

-- 
-- Insert data into lookup table for 'chatType'
INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
VALUES
  ('1:1 Chat', (SELECT id FROM lookup_type WHERE name = 'chatType'), NOW(), NOW()),
  ('Group Chat', (SELECT id FROM lookup_type WHERE name = 'chatType'), NOW(), NOW())
ON CONFLICT (lookup_type_id, label) DO NOTHING;
