import { executeQuery } from "../database/db.js";
import { HttpError } from "../helper/httpError.js";

export default class Lookup {
  constructor(reqObj) {}

  static async retrieveLookupList() {
    // SQL Query to fetch all LookupTypes with their associated Lookups
    const query = `
     SELECT 
       lt.id AS "lookupTypeId",
       lt.name AS "lookupTypeName",
       l.id AS "lookupId",
       l.label AS "lookupLabel"
     FROM lookup_type lt
     LEFT JOIN lookup l ON lt.id = l.lookup_type_id;
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

  static async getLookupTypeById(id) {
    const query = `
     SELECT 
       lt.id AS "lookupTypeId",
       lt.name AS "lookupTypeName",
       l.id AS "lookupId",
       l.label AS "lookupLabel"
     FROM lookup_type lt
     INNER JOIN lookup l ON lt.id = l.lookup_type_id
     WHERE lt.id = ${id};
    `;

    // Execute the query
    const results = await executeQuery(query);

    if (results.length === 0) {
      throw new HttpError("Lookup Type not found", 404);
    }

    const lookupType = results[0];

    const data = {
      id: lookupType.lookupTypeId,
      name: lookupType.lookupTypeName,
      lookups: [],
    };

    // Add Lookup entry if it exists
    results.forEach((row) => {
      if (row.lookupId) {
        data.lookups.push({
          id: row.lookupId,
          label: row.lookupLabel,
        });
      }
    });
    return data;
  }
}
