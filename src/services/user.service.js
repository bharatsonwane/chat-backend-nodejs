import { executeQuery } from "../database/db.js";
// import fsHelper from '../helper/functions/fsHelper.js';
// import uniqueId from '../helper/functions/uniqueIdHelper.js';
// import authHelper from '../helper/functions/authHelper.js';

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
    this.password = reqObj.password; // Store hashed password
    this.profilePicture = reqObj.profilePicture || null; // Picture URL
    this.bio = reqObj.bio || null; // User biography
    this.userStatusLookupId = reqObj.userStatusLookupId || null; // Foreign key to lookup table
    this.userRoleLookupId = reqObj.userRoleLookupId || null; // Foreign key to lookup table
    this.createdAt = reqObj.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async createUser() {
    // const productObj = new Product(reqObj);
    // const data = await productObj.createProduct();

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
                password,
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
                '${this.password}',
                '${this.profilePicture}',
                '${this.bio}',
                ${this.userStatusLookupId},
                ${this.userRoleLookupId},
                NOW(),
                NOW()
		    )
        RETURNING *;`;
    const results = await executeQuery(query);

    return results[0];
  }

  async managerRegister() {
    // this.userId = uniqueId.getuserId();
    // this.userActivationStatus = "pending";
    // this.userRole = "manager";
    // const data = fsHelper.authEmployeeExtractFileData(); // Read file data
    // const user = data.find(user => user.email === this.email);
    // if (user) {
    //     throw new Error("User already exists");
    // } else {
    //     const hashedPassword = await authHelper.hashPassword(this.password);
    //     this.password = hashedPassword;
    //     data.push(this);
    //     fsHelper.authEmployeeWriteFileData(data); // Write file data
    //     return this.email; // Return created object
    // }
  }

  async updateUser() {
    // const data = fsHelper.authEmployeeExtractFileData(); // Read file data
    // if (this.email) {
    //     const existingUserIndex = data.findIndex(user => user.email === this.email);
    //     if (existingUserIndex === -1) {
    //         throw new Error("User not found");
    //     }
    //     this.userId = data[existingUserIndex].userId; // Preserve user ID
    //     const newUserList = [...data];
    //     newUserList[existingUserIndex] = this;
    //     fsHelper.authEmployeeWriteFileData(newUserList); // Write file data
    //     return this; // Return updated object
    // } else {
    //     throw new Error("Email is required for updating a user");
    // }
  }

  static async userLogin(reqObj) {
    // const ownerData = fsHelper.authOwnerExtractFileData(); // Read owner file data
    // const ownerUser = ownerData.find(user => user.email === reqObj.email);
    // if (ownerUser) {
    //     const isPasswordValid = await authHelper.validatePassword(reqObj.password, ownerUser.password);
    //     if (isPasswordValid) {
    //         const jwtToken = await authHelper.createToken("all", "owner", ownerUser.userId, ownerUser.email);
    //         return { token: jwtToken, userRole: "owner" };
    //     } else {
    //         throw { statusCode: 400, message: "Email and password do not match" };
    //     }
    // } else {
    //     const data = fsHelper.authEmployeeExtractFileData(); // Read employee file data
    //     const user = data.find(user => user.email === reqObj.email);
    //     if (user) {
    //         if (user.userRole === "manager" && user.userActivationStatus !== "activate") {
    //             throw { statusCode: 501, message: "User status is pending or deactivated" };
    //         }
    //         const isPasswordValid = await authHelper.validatePassword(reqObj.password, user.password);
    //         if (isPasswordValid) {
    //             const jwtToken = await authHelper.createToken(user.divisionName, user.userRole, user.userId, user.email);
    //             return { token: jwtToken, divisionName: user.divisionName, userRole: user.userRole };
    //         } else {
    //             throw { statusCode: 501, message: "Email and password do not match" };
    //         }
    //     } else {
    //         throw { statusCode: 501, message: "User does not exist" };
    //     }
    // }
  }

  static async retrieveUserProfile(userInfo) {
    // let user;
    // if (userInfo.userRole === "owner") {
    //     const data = fsHelper.authOwnerExtractFileData(); // Read owner file data
    //     user = data.find(user => user.email === userInfo.userEmail);
    // } else {
    //     const data = fsHelper.authEmployeeExtractFileData(); // Read employee file data
    //     user = data.find(user => user.email === userInfo.userEmail);
    // }
    // if (user) {
    //     const userWithoutPassword = Object.fromEntries(
    //         Object.entries(user).filter(([key]) => key !== "password")
    //     );
    //     return userWithoutPassword;
    // } else {
    //     throw { statusCode: 400, message: "User does not exist" };
    // }
  }
}
