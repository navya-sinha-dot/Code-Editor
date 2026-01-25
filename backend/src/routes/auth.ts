import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/usermodels.js";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "navya the great";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All the fields are required",
      });
    }
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const passwordhash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordhash,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token,
      userId: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Signup failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "please signup first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordhash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
});

export default router;
