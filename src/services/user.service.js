import db from "../database/db.js";

export default class User {
  static columnMapping = {
    title: "title",
    firstName: "first_name",
    lastName: "last_name",
    middleName: "middle_name",
    maidenName: "maiden_name",
    gender: "gender",
    dob: "dob",
    bloodGroup: "blood_group",
    marriedStatus: "married_status",
    email: "email",
    phone: "phone",
    password: "password",
    hashPassword: "hash_password",
    profilePicture: "profile_picture",
    bio: "bio",
    userStatusLookupId: "user_status_lookup_id",
    userRoleLookupId: "user_role_lookup_id",
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  constructor(reqObj) {
    this.id = reqObj.id || null;
    this.title = reqObj.title || null; // ENUM type
    this.firstName = reqObj.firstName;
    this.lastName = reqObj.lastName;
    this.middleName = reqObj.middleName || null;
    this.maidenName = reqObj.maidenName || null;
    this.gender = reqObj.gender || null;
    this.dob = reqObj.dob;
    this.bloodGroup = reqObj.bloodGroup || null; // ENUM type
    this.marriedStatus = reqObj.marriedStatus || null;
    this.email = reqObj.email;
    this.phone = reqObj.phone;
    this.password = reqObj.password;
    this.hashPassword = reqObj.hashPassword;
    this.profilePicture = reqObj.profilePicture || null; // Picture URL
    this.bio = reqObj.bio || null; // User biography
    this.userStatusLookupId = reqObj.userStatusLookupId || null; // Foreign key to lookup table
    this.userRoleLookupId = reqObj.userRoleLookupId || null; // Foreign key to lookup table
    this.createdAt = reqObj.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async signupUser() {
    /* insert user */
    const userSignupQuery = `
        INSERT INTO user_profile (
                email,
                password,
                phone,
                first_name,
                last_name,
                user_status_lookup_id,
                user_role_lookup_id,
                created_at,
                updated_at
            ) VALUES (
                '${this.email}',
                '${this.hashPassword}',
                '${this.phone}',
                '${this.firstName}',
                '${this.lastName}',
                ${this.userStatusLookupId},
                ${this.userRoleLookupId},
                NOW(),
                NOW()
        )
        RETURNING *;`;
    const results = await db.query(userSignupQuery);
    const response = results[0];
    return response;
  }

  async getUserByEmailOrPhone() {
    const queryString = `
        SELECT 
        up.id,
        up.title,
        up.first_name,
        up.last_name,
        up.middle_name,
        up.maiden_name,
        up.gender,
        up.dob,
        up.blood_group,
        up.married_status,
        up.email,
        up.phone,
        up.password,
        up.profile_picture,
        up.bio,
        up.user_status_lookup_id,
        up.user_role_lookup_id,
        usl.label AS user_status,
        url.label AS user_role,
        up.created_at,
        up.updated_at
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up.user_status_lookup_id = usl.id
      LEFT JOIN 
        lookup url ON up.user_role_lookup_id = url.id
      WHERE email = '${this.email}' OR phone = '${this.phone}';`;

    const results = await db.query(queryString);
    const response = results[0];

    return response;
  }

  async getUserById() {
    const queryString = `
    SELECT 
    up.id,
    up.title,
    up.first_name,
    up.last_name,
    up.middle_name,
    up.maiden_name,
    up.gender,
    up.dob,
    up.blood_group,
    up.married_status,
    up.email,
    up.phone,
    up.profile_picture,
    up.bio,
    up.user_status_lookup_id,
    up.user_role_lookup_id,
    usl.label AS user_status,
    url.label AS user_role,
    up.created_at,
    up.updated_at
  FROM 
    user_profile up
  LEFT JOIN 
    lookup usl ON up.user_status_lookup_id = usl.id
  LEFT JOIN 
    lookup url ON up.user_role_lookup_id = url.id
  WHERE up.id = ${this.id};`;

    const results = await db.query(queryString);
    const response = results[0];

    return response;
  }

  static async getUsers() {
    const queryString = `
        SELECT 
          up.id,
          up.title,
          up.first_name,
          up.last_name,
          up.middle_name,
          up.maiden_name,
          up.gender,
          up.dob,
          up.blood_group,
          up.married_status,
          up.email,
          up.phone,
          up.profile_picture,
          up.bio,
          up.user_status_lookup_id,
          up.user_role_lookup_id,
          usl.label AS user_status,
          url.label AS user_role,
          up.created_at,
          up.updated_at
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up.user_status_lookup_id = usl.id
      LEFT JOIN 
        lookup url ON up.user_role_lookup_id = url.id;`;

    const results = await db.query(queryString);

    return results;
  }

  async updateUserInfo() {
    const acceptedKeys = [
      "title",
      "firstName",
      "lastName",
      "middleName",
      "maidenName",
      "gender",
      "dob",
      "bloodGroup",
      "marriedStatus",
      "bio",
    ];

    const setQueryString = Object.keys(this)
      .filter(
        (key) =>
          this[key] !== undefined &&
          this[key] !== null &&
          acceptedKeys.includes(key)
      )
      .map(
        (key) =>
          `${User.columnMapping[key] ? User.columnMapping[key] : key} = '${
            this[key]
          }'`
      )
      .join(", ");

    const queryString = `
      UPDATE user_profile
      SET ${setQueryString}
      WHERE id = ${this.id} RETURNING *;`;
    const results = await db.query(queryString);

    delete results[0].password;
    return results[0];
  }

  async updateUserPassword() {
    const queryString = `
      UPDATE user_profile
      SET password = '${this.hashPassword}'
      WHERE id = ${this.id} RETURNING *;`;
    const results = await db.query(queryString);

    delete results[0].password;
    return results[0];
  }

  async createUserInfo() {
    const acceptedKeys = [
      "title",
      "firstName",
      "lastName",
      "middleName",
      "maidenName",
      "gender",
      "dob",
      "bloodGroup",
      "marriedStatus",
      "email",
      "phone",
      "hashPassword",
      "profilePicture",
      "bio",
      "userStatusLookupId",
      "userRoleLookupId",
    ];

    const keysToInsert = acceptedKeys.filter(
      (key) => this[key] !== undefined && this[key] !== null
    );

    const columns = keysToInsert.map((key) => User.columnMapping[key] || key);
    const values = keysToInsert.map((key) => `'${this[key]}'`);

    const queryString = `
    INSERT INTO user_profile (
      ${columns.join(", ")},
      created_at,
      updated_at
    ) VALUES (
      ${values.join(", ")},
      NOW(),
      NOW()
    )
    RETURNING *;
  `;

    const results = await db.query(queryString);
    const response = results[0];
    delete response.password;

    return response;
  }
}
