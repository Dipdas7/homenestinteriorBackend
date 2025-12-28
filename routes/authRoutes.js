const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// 🔒 Allowed Emails
const ALLOWED_EMAILS = [
  "admin@homenestinterior.in",
  "owner@homenestinterior.in"
];

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!ALLOWED_EMAILS.includes(email)) {
    return res.status(403).json({ message: "Email not allowed" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
