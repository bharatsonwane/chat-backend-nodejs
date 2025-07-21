import logger from "../helper/logger.js";
import db from "./db.js";
import { getHashPassword } from "../helper/authHelper.js";

async function main() {
  try {
    logger.log("seed main function called");

    // First, create tables if they don't exist
    await createTables();

    const upsertAndFetchLookupData = async () => {
      const lookupTypeList = [
        {
          name: "userRole",
          lookups: [
            { label: "Super Admin" },
            { label: "Admin" },
            { label: "Standard" },
          ],
        },
        {
          name: "userStatus",
          lookups: [
            { label: "Pending" },
            { label: "Active" },
            { label: "Deleted" },
            { label: "Blocked" },
          ],
        },
        {
          name: "chatType",
          lookups: [{ label: "1:1 Chat" }, { label: "Group Chat" }],
        },
      ];

      for (const lookupType of lookupTypeList) {
        /** Step 1: Upsert LookupType */
        const upsertLookupTypeQuery = `
          INSERT INTO lookup_type (name, created_at, updated_at)
          VALUES ($1, NOW(), NOW())
          ON CONFLICT (name) DO UPDATE
          SET updated_at = NOW()
          RETURNING id, name;
        `;

        const lookupTypeResult = await db.query(upsertLookupTypeQuery, [
          lookupType.name,
        ]);
        const { id: lookupTypeId, name: lookupTypeName } = lookupTypeResult[0];

        logger.info(`Upserted lookup type: ${lookupTypeName} with ID: ${lookupTypeId}`);

        /** Step 2: Upsert Lookups for this LookupType */
        for (const lookup of lookupType.lookups) {
          const upsertLookupQuery = `
            INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
            VALUES ($1, $2, NOW(), NOW())
            ON CONFLICT (label, lookup_type_id) DO UPDATE
            SET updated_at = NOW()
            RETURNING id, label, lookup_type_id
          `;
          const lookupResult = await db.query(upsertLookupQuery, [
            lookup.label,
            lookupTypeId
          ]);
          
          if (lookupResult.length > 0) {
            logger.info(`Upserted lookup: ${lookup.label} with ID: ${lookupResult[0].id}`);
          }
        }
      }

      const getLookupDataByTypeLabel = async (lookupTypeName, lookupLabel) => {
        const getLookupDataQuery = `
          SELECT l.id, l.label, l.lookup_type_id, lt.name as lookup_type_name
          FROM lookup_type lt
          INNER JOIN lookup l ON lt.id = l.lookup_type_id
          WHERE lt.name = $1 AND l.label = $2;
        `;

        const lookupDataResult = await db.query(getLookupDataQuery, [
          lookupTypeName,
          lookupLabel,
        ]);
        
        if (lookupDataResult.length === 0) {
          throw new Error(`Lookup data not found for type: ${lookupTypeName}, label: ${lookupLabel}`);
        }
        
        return lookupDataResult[0];
      };

      return { getLookupDataByTypeLabel };
    };

    const { getLookupDataByTypeLabel } = await upsertAndFetchLookupData();

    // Get lookup data for user roles and status
    const superAdminRoleData = await getLookupDataByTypeLabel(
      "userRole",
      "Super Admin"
    );

    const adminRoleData = await getLookupDataByTypeLabel("userRole", "Admin");

    const activeUserStatusData = await getLookupDataByTypeLabel(
      "userStatus",
      "Active"
    );

    logger.info(`Super Admin Role ID: ${superAdminRoleData.id}`);
    logger.info(`Admin Role ID: ${adminRoleData.id}`);
    logger.info(`Active Status ID: ${activeUserStatusData.id}`);

    const upsertAndFetchUserData = async () => {
      const userDataList = [
        {
          title: "Mr",
          firstName: "SuperFirstName1",
          lastName: "SuperLastName",
          middleName: "SuperMiddleName",
          maidenName: "",
          gender: "Male",
          dob: "1995-07-31",
          bloodGroup: "B+",
          marriedStatus: "Married",
          email: "bharatsdev@gmail.com",
          phone: "1234567890",
          password: "Super@123",
          profilePicture: "",
          bio: "This is Super Admin",
          userStatusLookupId: activeUserStatusData.id,
          userRoleLookupId: superAdminRoleData.id,
        },
        {
          title: "Mr",
          firstName: "AdminFirstName",
          lastName: "AdminLastName",
          middleName: "AdminMiddleName",
          maidenName: "",
          gender: "Male",
          dob: "1995-06-19",
          bloodGroup: "B+",
          marriedStatus: "Single",
          email: "shantanu@gmail.com",
          phone: "1234567891",
          password: "Admin@123",
          profilePicture: "",
          bio: "This is Admin user",
          userStatusLookupId: activeUserStatusData.id,
          userRoleLookupId: adminRoleData.id,
        },
      ];

      for (const userData of userDataList) {
        try {
          // Hash the password
          const hashedPassword = await getHashPassword(userData.password);
          
          // Check if user already exists
          const checkUserQuery = `
            SELECT id, email FROM user_profile WHERE email = $1;
          `;
          const existingUser = await db.query(checkUserQuery, [userData.email]);
          
          if (existingUser.length > 0) {
            logger.info(`User already exists: ${userData.email}`);
            continue;
          }

          // Insert new user
          const upsertUserQuery = `
            INSERT INTO user_profile (
              title,
              first_name,
              last_name,
              middle_name,
              maiden_name,
              gender,
              dob,
              blood_group,
              married_status,
              email,
              phone,
              password,
              profile_picture,
              bio,
              user_status_lookup_id,
              user_role_lookup_id,
              created_at,
              updated_at)
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
            )
            RETURNING id, email, first_name, last_name;
          `;

          const userResult = await db.query(upsertUserQuery, [
            userData.title,
            userData.firstName,
            userData.lastName,
            userData.middleName,
            userData.maidenName,
            userData.gender,
            userData.dob,
            userData.bloodGroup,
            userData.marriedStatus,
            userData.email,
            userData.phone,
            hashedPassword,
            userData.profilePicture,
            userData.bio,
            userData.userStatusLookupId,
            userData.userRoleLookupId
          ]);
          
          if (userResult.length > 0) {
            const userResponse = userResult[0];
            logger.info(`User created successfully: ${userResponse.email} (ID: ${userResponse.id})`);
          }
        } catch (userError) {
          logger.error(`Error creating user ${userData.email}:`, userError);
        }
      }
    };

    await upsertAndFetchUserData();
    logger.info("Seeding completed successfully!");
    
  } catch (error) {
    logger.error("Error occurred during seeding:", error);
    throw error; // Re-throw to ensure the process exits with error code
  } finally {
    logger.info("Seeding reached to finally!");
  }
}

async function createTables() {
  try {
    logger.info("Creating database tables...");

    // Create lookup_type table
    const createLookupTypeTable = `
      CREATE TABLE IF NOT EXISTS lookup_type (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await db.query(createLookupTypeTable);
    logger.info("lookup_type table created/verified");

    // Create lookup table
    const createLookupTable = `
      CREATE TABLE IF NOT EXISTS lookup (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        lookup_type_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (lookup_type_id) REFERENCES lookup_type(id) ON DELETE CASCADE,
        UNIQUE(label, lookup_type_id)
      );
    `;

    await db.query(createLookupTable);
    logger.info("lookup table created/verified");

    // Create user_profile table
    const createUserProfileTable = `
      CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        title VARCHAR(10),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        maiden_name VARCHAR(100),
        gender VARCHAR(20),
        dob DATE,
        blood_group VARCHAR(10),
        married_status VARCHAR(20),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        profile_picture TEXT,
        bio TEXT,
        user_status_lookup_id INTEGER,
        user_role_lookup_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_status_lookup_id) REFERENCES lookup(id),
        FOREIGN KEY (user_role_lookup_id) REFERENCES lookup(id)
      );
    `;

    await db.query(createUserProfileTable);
    logger.info("user_profile table created/verified");

    // Create indexes for better performance
    const createIndexes = [
      `CREATE INDEX IF NOT EXISTS idx_lookup_type_name ON lookup_type(name);`,
      `CREATE INDEX IF NOT EXISTS idx_lookup_type_label ON lookup(lookup_type_id, label);`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_email ON user_profile(email);`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_status ON user_profile(user_status_lookup_id);`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_role ON user_profile(user_role_lookup_id);`
    ];

    for (const indexQuery of createIndexes) {
      await db.query(indexQuery);
    }
    
    logger.info("Database indexes created/verified");
    logger.info("All tables created successfully!");

  } catch (error) {
    logger.error("Error creating tables:", error);
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  logger.error('Fatal error in main function:', error);
  process.exit(1);
});