
export const up = async (client) => {
  // Define lookup data structure
  const lookupData = [
    {
      lookupType: "userRole",
      lookups: [
        { label: "Super Admin" },
        { label: "Admin" },
        { label: "Standard" },
      ],
    },
    {
      lookupType: "userStatus",
      lookups: [
        { label: "Pending" },
        { label: "Active" },
        { label: "Deleted" },
        { label: "Blocked" },
      ],
    },
    {
      lookupType: "chatType",
      lookups: [{ label: "1:1 Chat" }, { label: "Group Chat" }],
    },
  ];

  // Process each lookup type and its lookups
  for (const data of lookupData) {
    // Insert lookup type and get the ID
    const lookupTypeResult = await client.query(
      `
            INSERT INTO lookup_type (name, created_at, updated_at)
            VALUES ($1, NOW(), NOW())
            ON CONFLICT (name) DO NOTHING
            RETURNING id;
        `,
      [data.lookupType]
    );

    // If lookup type was inserted (not already existed), get the ID
    let lookupTypeId;
    if (lookupTypeResult.rows.length > 0) {
      lookupTypeId = lookupTypeResult.rows[0].id;
    } else {
      // If it already existed, fetch the existing ID
      const existingResult = await client.query(
        "SELECT id FROM lookup_type WHERE name = $1",
        [data.lookupType]
      );
      lookupTypeId = existingResult.rows[0].id;
    }

    // Insert lookups for this type
    for (const lookup of data.lookups) {
      await client.query(
        `
                INSERT INTO lookup (label, lookup_type_id, created_at, updated_at)
                VALUES ($1, $2, NOW(), NOW())
                ON CONFLICT (lookup_type_id, label) DO NOTHING;
            `,
        [lookup.label, lookupTypeId]
      );
    }
  }
};

export const down = async (client) => {};
