// src/routes/auth.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.json({ message: "Registration successful", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users (admin only - passwords excluded by default)
router.get("/", async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;