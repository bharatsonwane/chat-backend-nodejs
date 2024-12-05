import { query } from "../database/db.js";

export default class Product {
  constructor(reqObj) {}

  static async retrieveLookupList() {
    // const [rows] = await query(`
    //   SELECT * FROM lookupType
    //   LEFT JOIN lookup ON lookuptype.id = lookup.lookupTypeId;
    // `);
  }
}
