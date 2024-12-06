import { executeQuery } from "../database/db.js";

export default class Product {
  constructor(reqObj) {}

  static async retrieveLookupList() {
    // const [rows] = await executeQuery(`
    //   SELECT * FROM lookupType
    //   LEFT JOIN lookup ON lookuptype.id = lookup.lookupTypeId;
    // `);

    // SQL Query to fetch all LookupTypes with their associated Lookups
    const query = `
     SELECT 
       lt.id AS "lookupTypeId",
       lt.name AS "lookupTypeName",
       l.id AS "lookupId",
       l.name AS "lookupName",
       l.label AS "lookupLabel",
       l.lookupTypeId AS "lookupTypeReferenceId"
     FROM LookupType lt
     LEFT JOIN Lookup l ON lt.id = l.lookupTypeId;
   `;

    // Execute the query
    const results = await executeQuery(query);

    // Group results by LookupType
    const groupedData = results.reduce((acc, row) => {
      const {
        lookupTypeId,
        lookupTypeName,
        lookupId,
        lookupName,
        lookupLabel,
        lookupTypeReferenceId,
      } = row;

      // Find or create the LookupType entry
      let lookupType = acc.find((item) => item.id === lookupTypeId);
      if (!lookupType) {
        lookupType = {
          id: lookupTypeId,
          name: lookupTypeName,
          lookups: [],
        };
        acc.push(lookupType);
      }

      // Add Lookup entry if it exists
      if (lookupId) {
        lookupType.lookups.push({
          id: lookupId,
          name: lookupName,
          label: lookupLabel,
          lookupTypeId: lookupTypeReferenceId,
        });
      }

      return acc;
    }, []);

    return groupedData;
  }
}
