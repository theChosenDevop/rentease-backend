import jwt from "jsonwebtoken";
export const generateToken = (userId, email, role) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const options = { expiresIn };
    return jwt.sign({ id: userId, email, role }, secret, options);
};
//# sourceMappingURL=generateToken.js.map