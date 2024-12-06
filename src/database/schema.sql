-- 
CREATE TABLE IF NOT EXISTS LookupType (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);
-- 
CREATE TABLE IF NOT EXISTS Lookup (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    lookupTypeId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_lookup_lookupType FOREIGN KEY (lookupTypeId) REFERENCES LookupType (id) ON DELETE CASCADE,
    CONSTRAINT unique_lookupTypeId_label UNIQUE (lookupTypeId, label)
);


-- Create title_enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'title_enum') THEN
        CREATE TYPE title_enum AS ENUM ('Mr', 'Mrs', 'Ms');
    END IF;
END $$;

-- Create blood_group_enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group_enum') THEN
        CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
    END IF;
END $$;

-- user_profile
CREATE TABLE IF NOT EXISTS user_profile (
    id SERIAL PRIMARY KEY,
    title title_enum, -- Use ENUM type
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    middleName VARCHAR(255),
    maidenName VARCHAR(255),
    gender VARCHAR(50),
    dob DATE,
    bloodGroup blood_group_enum, -- Use ENUM type
    marriedStatus BOOLEAN,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);

-- user_account
-- Create user_status_enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
        CREATE TYPE user_status_enum AS ENUM ('active', 'inactive');
    END IF;
END $$;

-- Create user_account table
CREATE TABLE IF NOT EXISTS user_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255),  -- Store hashed password
    status user_status_enum NOT NULL, -- Enum for status (active, inactive)
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    userProfileId INT NOT NULL,
    userRoleLookupId INT NOT NULL,
    CONSTRAINT fk_user_account_user_profile FOREIGN KEY (userProfileId) REFERENCES user_profile (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_account_user_role_lookup FOREIGN KEY (userRoleLookupId) REFERENCES Lookup (id) ON DELETE CASCADE
);


