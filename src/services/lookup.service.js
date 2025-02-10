import db from "../database/db.js";
import { HttpError } from "../helper/httpError.js";

export default class Lookup {
  constructor(reqObj) {}

  static async retrieveLookupList() {
    // SQL Query to fetch all LookupTypes with their associated Lookups
    const queryString = `
     SELECT 
       lt.id AS "lookupTypeId",
       lt.name AS "lookupTypeName",
       l.id AS "lookupId",
       l.label AS "lookupLabel"
     FROM lookup_type lt
     LEFT JOIN lookup l ON lt.id = l.lookup_type_id;
   `;

    // Execute the queryString
    const results = await db.query(queryString);

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
    const queryString = `
     SELECT 
       lt.id AS "lookupTypeId",
       lt.name AS "lookupTypeName",
       l.id AS "lookupId",
       l.label AS "lookupLabel"
     FROM lookup_type lt
     INNER JOIN lookup l ON lt.id = l.lookup_type_id
     WHERE lt.id = ${id};
    `;

    // Execute the queryString
    const results = await db.query(queryString);

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

  static async getUserStatusPendingId() {
    const queryString = `
      SELECT l.id 
      FROM lookup l
      INNER JOIN lookup_type lt ON l.lookup_type_id = lt.id
      WHERE l.label = 'Pending' AND lt.name = 'userStatus';
    `;
    const results = await db.query(queryString);

    if (results.length === 0) {
      throw new HttpError("Lookup Pending user_status not found.", 404);
    }

    return results[0].id;
  }

  static async getUserRoleUserId() {
    const queryString = `
      SELECT l.id
      FROM lookup l
      INNER JOIN lookup_type lt ON l.lookup_type_id = lt.id
      WHERE l.label = 'Standard' AND lt.name = 'userRole';`;
    const results = await db.query(queryString);

    if (results.length === 0) {
      throw new HttpError("Lookup User user_role not found.", 404);
    }

    return results[0].id;
  }
}
