import logger from "../helper/logger.js";
import { executeQuery } from "./db.js";
import { getHashPassword } from "../helper/authHelper.js";

async function main() {
  try {
    logger.log("seed main function called");

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

        const lookupTypeResult = await executeQuery(upsertLookupTypeQuery, [
          lookupType.name,
        ]);
        const { id: lookupTypeId, name: lookupTypeName } = lookupTypeResult[0];

        /** Step 2: Upsert Lookups for this LookupType */
        for (const lookup of lookupType.lookups) {
          const upsertLookupQuery = `
            INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
            VALUES ('${lookup.label}', ${lookupTypeId}, NOW(), NOW())
            ON CONFLICT (label, lookup_type_id) DO NOTHING
            RETURNING id, label, lookup_type_id
          `;

          const lookupResult = await executeQuery(upsertLookupQuery);
          console.log("lookupResult", lookupResult);
        }
      }

      
      const getLookupDataByTypeLabel = async (lookupTypeName, lookupLabel) => {
        const getLookupDataQuery = `
          SELECT * FROM lookup_type lt
          INNER JOIN lookup l ON lt.id = l.lookup_type_id
          WHERE lt.name = $1 AND l.label = $2;
        `;
        const lookupDataResult = await executeQuery(getLookupDataQuery, [
          lookupTypeName,
          lookupLabel,
        ]);
        return lookupDataResult[0];
      };

      return { getLookupDataByTypeLabel };
    };

    const { getLookupDataByTypeLabel } = await upsertAndFetchLookupData();
    console.log("superAdmin2");

    const superAdmin = await getLookupDataByTypeLabel(
      "userRole",
      "Super Admin"
    );

    const upsertAndFetchUserData = async () => {
      const userDataList = [
        {
          title: "Mr",
          firstName: "SuperFirstName",
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
          userStatusLookupId: 0,
          userRoleLookupId: 0,
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
          userStatusLookupId: 0,
          userRoleLookupId: 0,
        },
      ];

      // const superAdmin = await getLookupDataByTypeLabel(
      //   "userRole",
      //   "Super Admin"
      // );

      for (const userData of userDataList) {
        // Step 1: Upsert User and on conflict skip and return user

        const hashedPassword = await getHashPassword(userData.password);
        const upsertUserQuery = `
          INSERT INTO "User" (
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
              ${userData.title},
              ${userData.firstName},
              ${userData.lastName},
              ${userData.middleName},
              ${userData.maidenName},
              ${userData.gender},
              ${userData.dob},
              ${userData.bloodGroup},
              ${userData.marriedStatus},
              ${userData.email},
              ${userData.phone},
              ${hashedPassword},
              ${userData.profilePicture},
              ${userData.bio},
              ${userData.userStatusLookupId},
              ${userData.userRoleLookupId},
              NOW(),
              NOW()
          )
          ON CONFLICT (email) DO NOTHING
          RETURNING *;
        `;

        const userResult = await executeQuery(upsertUserQuery);
        const userResponse = userResult[0];
      }
      console.log("Upsert operation completed successfully!");
    };
    // const userData = await upsertAndFetchUserData();
    // console.log("userData", userData);
  } catch (error) {
    logger.error("Error occurred during seeding:", error);
  } finally {
    logger.info("Seeding reached to finally!");
  }
}

main();
