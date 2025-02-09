import { validateJwtToken } from "../helper/authHelper.js";

export const authRoleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      // Validate the token
      const decoded = await validateJwtToken(token);
      req.user = decoded;

      // Extract user role from the decoded token
      const userRole = typeof decoded !== "string" ? decoded?.userRole : null;

      // If no specific roles are required, proceed to the next middleware
      if (allowedRoles.length === 0) {
        return next();
      }

      // Check if the user's role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Access forbidden: Insufficient permissions." });
      }

      // Proceed to the next middleware
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
  };
};
