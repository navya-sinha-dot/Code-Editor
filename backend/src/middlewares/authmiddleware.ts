import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

interface JwtUserPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "navya the great";
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token as string,
        JWT_SECRET
      ) as unknown as JwtUserPayload;

      req.userId = decoded.userId;
      next();
    } catch (err) {
      console.error("JWT Verification failed:", err instanceof Error ? err.message : err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
