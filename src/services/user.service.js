import { executeQuery } from "../database/db.js";
import {
  createTwtToken,
  getHashPassword,
  validatePassword,
} from "../helper/authHelper.js";
import { HttpError } from "../helper/httpError.js";

export default class User {
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
    const results = await executeQuery(userSignupQuery);
    const response = results[0];
    return response;
  }

  async getUserByEmailOrPhone() {
    const query = `
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

    const results = await executeQuery(query);
    const response = results[0];

    return response;
  }

  async getUserById() {
    const query = `
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

    const results = await executeQuery(query);
    const response = results[0];

    return response;
  }

  async updateUser() {
    const query = `
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
                profile_picture,
                bio,
                user_status_lookup_id,
                user_role_lookup_id,
                created_at,
                updated_at
            ) VALUES (
                '${this.title}',
                '${this.firstName}',
                '${this.lastName}',
                '${this.middleName}',
                '${this.maidenName}',
                '${this.gender}',
                '${this.dob}',
                '${this.bloodGroup}',
                '${this.marriedStatus}',
                '${this.email}',
                '${this.phone}',
                '${this.profilePicture}',
                '${this.bio}',
                ${this.userStatusLookupId},
                ${this.userRoleLookupId},
                NOW(),
                NOW()
		    )
        RETURNING *;`;
    const results = await executeQuery(query);
    const response = results[0];

    delete response.password;

    return response;
  }
}
