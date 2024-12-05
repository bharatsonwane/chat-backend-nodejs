import User from '../services/user.service.js';

export const postManagerRegister = async (req, res, next) => {
    try {
        const reqObj = req.body;
        const userObject = new User(reqObj);
        const registeredUser = await userObject.managerRegister();
        const response = {
            user: registeredUser,
            message: "Manager Registered Successfully..."
        };
        res.status(200).send(response);
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).send({ error: error.message });
    }
};

export const postUserLogin = async (req, res, next) => {
    try {
        const reqObj = req.body;
        const resObj = await User.userLogin(reqObj);
        res.status(200).send(resObj);
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).send({ error: error.message });
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const userInfo = req.userInfo;
        const resObj = await User.retrieveUserProfie(userInfo);
        res.status(200).send(resObj);
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).send({ error: error.message });
    }
};

// export const putResetPassword = async (req, res, next) => {
//     const { userId, email, forename, dob, password } = req.body;
//     try {
//         const authObject = new User(userId, email, forename, dob, password);
//         const updatedTaskData = await authObject.resetPassword();
//         res.status(200).send(updatedTaskData);
//     } catch (error) {
//         res.status(error.statusCode ? error.statusCode : 500).send({ error: error.message });
//     }
// };
