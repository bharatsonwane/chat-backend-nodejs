-- lookup_type Table
CREATE TABLE IF NOT EXISTS lookup_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- lookup Table
CREATE TABLE IF NOT EXISTS lookup (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    lookup_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_lookup_lookup_type FOREIGN KEY (lookup_type_id) REFERENCES lookup_type (id),
    CONSTRAINT unique_lookup_type_id_label UNIQUE (lookup_type_id, label)
);

-- title_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'title_enum') THEN
        CREATE TYPE title_enum AS ENUM ('Mr', 'Mrs', 'Ms');
    END IF;
END $$;

-- gender_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
        CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
    END IF;
END $$;

-- blood_group_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group_enum') THEN
        CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
    END IF;
END $$;

-- married_status_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'married_status_enum') THEN
        CREATE TYPE married_status_enum AS ENUM ( 'Single', 'Married', 'Divorced', 'Widowed');
    END IF;
END $$;

-- user_profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id SERIAL PRIMARY KEY,
    title title_enum, -- Use ENUM type
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    maiden_name VARCHAR(255),
    gender gender_enum, -- Use ENUM type
    dob DATE,
    blood_group blood_group_enum, -- Use ENUM type
    married_status married_status_enum,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),  -- Store hashed password
    profile_picture VARCHAR(255), -- Picture URL
    bio TEXT, -- User biography
    user_status_lookup_id INT, -- Foreign key to lookup table
    user_role_lookup_id INT,   -- Foreign key to lookup table
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_status_lookup FOREIGN KEY (user_status_lookup_id) REFERENCES lookup (id) ON DELETE SET NULL,
    CONSTRAINT fk_user_role_lookup FOREIGN KEY (user_role_lookup_id) REFERENCES lookup (id) ON DELETE SET NULL
);

-- chat_room_type_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_room_type_enum') THEN
        CREATE TYPE chat_room_type_enum AS ENUM ('one_to_one', 'group');
    END IF;
END $$;

-- chat_room Table
CREATE TABLE IF NOT EXISTS chat_room (
    id SERIAL PRIMARY KEY,
    type chat_room_type_enum NOT NULL, -- ENUM for chat room type
    description TEXT, -- Chat room description
    image VARCHAR(255), -- Image URL for the chat room
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL -- Indicates if the chat room is active
);

-- user_chat_room_mapping Table
CREATE TABLE IF NOT EXISTS user_chat_room_mapping (
    id SERIAL PRIMARY KEY,
    user_profile_id INT NOT NULL, -- Foreign key to user_profile table
    chat_room_id INT NOT NULL, -- Foreign key to chat_room table
    is_admin BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the user is an admin in the chat room
    is_active BOOLEAN DEFAULT TRUE NOT NULL, -- Indicates if the mapping is active
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_profile FOREIGN KEY (user_profile_id) REFERENCES user_profile (id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room (id) ON DELETE CASCADE
);


-- chat_message Table
CREATE TABLE IF NOT EXISTS chat_message (
    id SERIAL PRIMARY KEY,
    text TEXT, -- Message text content
    media VARCHAR(255), -- Media URL or file path
    is_edited BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the message is edited
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the message is deleted
    delivered_to JSON, -- JSON array storing who the message is delivered to
    read_by JSON, -- JSON array storing who has read the message
    reaction JSON, -- JSON storing reactions to the message
    sent_user_id INT NOT NULL, -- Foreign key to user_profile table
    chat_room_id INT NOT NULL, -- Foreign key to chat_room table
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_sent_user FOREIGN KEY (sent_user_id) REFERENCES user_profile (id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room (id) ON DELETE CASCADE
);
