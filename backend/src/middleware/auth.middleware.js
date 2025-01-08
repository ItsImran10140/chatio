import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById((decoded).userId).select(
      "-password"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ");
    res.status(500).json({ message: "Internal server error" });
  }
};
