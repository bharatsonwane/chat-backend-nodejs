// import fsHelper from '../helper/functions/fsHelper.js';
// import uniqueId from '../helper/functions/uniqueIdHelper.js';
// import authHelper from '../helper/functions/authHelper.js';

export default class User {
    constructor(reqObj) {
        this.createdBy = null;
        this.createdOn = reqObj?.createdOn || new Date().toISOString();
        this.modifiedBy = null;
        this.modifiedOn = null;
        this.divisionName = reqObj.divisionName;
        this.userId = reqObj.userId;
        this.userRole = null;
        this.userActivationStatus = null;
        this.forename = reqObj.forename;
        this.surname = reqObj.surname;
        this.marriedStatus = null;
        this.phoneNumber = null;
        this.email = reqObj.email;
        this.dob = reqObj.dob;
        this.gender = null;
        this.programmingLanguageKnown = [];
        this.address = null;
        this.password = reqObj.password;
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
