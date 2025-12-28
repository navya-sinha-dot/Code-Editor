import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "navya the great";
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=authmiddleware.js.map