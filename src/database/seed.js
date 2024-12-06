import { executeQuery } from "./db.js";

async function main() {
  try {
    const upsertAndFetchLookupData = async () => {
      const lookupTypeList = [
        {
          name: "role",
          lookups: [
            { label: "Super Admin", name: "roleSuperAdmin" },
            { label: "Admin", name: "roleAdmin" },
            { label: "User", name: "roleUser" },
          ],
        },
        {
          name: "chatType",
          lookups: [
            { label: "1:1 Chat", name: "chatType1:1" },
            { label: "Group Chat", name: "chatTypeGroup" },
          ],
        },
      ];

      const output = []; // To hold the final formatted result

      for (const lookupType of lookupTypeList) {
        // Step 1: Upsert LookupType
        const upsertLookupTypeQuery = `
          INSERT INTO LookupType (name, createdAt, updatedAt)
          VALUES ($1, NOW(), NOW())
          ON CONFLICT (name) DO UPDATE
          SET updatedAt = NOW()
          RETURNING id, name;
        `;
        const lookupTypeResult = await executeQuery(upsertLookupTypeQuery, [
          lookupType.name,
        ]);
        const { id: lookupTypeId, name: lookupTypeName } = lookupTypeResult[0];

        // Prepare the lookups array for this LookupType
        const lookupsArray = [];

        // Step 2: Upsert Lookups for this LookupType
        for (const lookup of lookupType.lookups) {
          const upsertLookupQuery = `
            INSERT INTO Lookup (name, label, lookupTypeId, createdAt, updatedAt)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (name) DO UPDATE
            SET label = $2, lookupTypeId = $3, updatedAt = NOW()
            RETURNING id, name, label, lookupTypeId;
          `;
          const lookupResult = await executeQuery(upsertLookupQuery, [
            lookup.name,
            lookup.label,
            lookupTypeId,
          ]);

          lookupsArray.push(lookupResult[0]); // Add the upserted/updated lookup to the array
        }

        // Add the LookupType with its Lookups to the output
        output.push({
          id: lookupTypeId,
          name: lookupTypeName,
          lookups: lookupsArray,
        });
      }

      console.log("Upsert operation completed successfully!");

      return output;
    };
    const lookupData = await upsertAndFetchLookupData();

    console.log("lookupData", lookupData);
  } catch (error) {
    console.error("Error occurred during seeding:", error);
  } finally {
  }
}

main();
