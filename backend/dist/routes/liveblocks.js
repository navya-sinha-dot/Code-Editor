import { Router } from "express";
import jwt from "jsonwebtoken";
import { Liveblocks } from "@liveblocks/node";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
});
const JWT_SECRET = process.env.JWT_SECRET;
function isAuthJwtPayload(decoded) {
    return (typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        typeof decoded.userId === "string");
}
router.post("/auth", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!isAuthJwtPayload(decoded)) {
            return res.status(403).json({ error: "Invalid token payload" });
        }
        const session = liveblocks.prepareSession(decoded.userId, {
            userInfo: {
                name: decoded.userId,
            },
        });
        session.allow("*", session.FULL_ACCESS);
        const { status, body } = await session.authorize();
        res.status(status).send(body);
    }
    catch (err) {
        console.error("Liveblocks auth error:", err);
        res.status(403).json({ error: "Unauthorized" });
    }
});
export default router;
//# sourceMappingURL=liveblocks.js.map