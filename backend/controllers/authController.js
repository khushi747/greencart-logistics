const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Register a new manager POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      role: role || "manager",
    });

    res.status(201).json({
      _id: user._id, // Fixed: was using *id instead of _id
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Login user POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      _id: user._id, // Fixed: was using *id instead of _id
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { registerUser, loginUser };
