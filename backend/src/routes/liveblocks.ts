import { Router } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Liveblocks } from "@liveblocks/node";
import dotenv from "dotenv";
import { User } from "../models/usermodels.js";

dotenv.config();

const router = Router();

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

function isAuthJwtPayload(
  decoded: string | JwtPayload
): decoded is AuthJwtPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    "userId" in decoded &&
    typeof (decoded as any).userId === "string"
  );
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

    // Fetch actual user name from database
    const user = await User.findById(decoded.userId).select("name").lean();
    const userName = user?.name || "Anonymous";

    const session = liveblocks.prepareSession(decoded.userId, {
      userInfo: {
        name: userName,
      },
    });

    session.allow("*", session.FULL_ACCESS);

    const { status, body } = await session.authorize();
    res.status(status).send(body);
  } catch (err) {
    console.error("Liveblocks auth error:", err);
    res.status(403).json({ error: "Unauthorized" });
  }
});

export default router;
