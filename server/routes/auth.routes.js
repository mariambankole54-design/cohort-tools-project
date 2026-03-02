const router = require("express").Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res, next) => {
  console.log(req.body);

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).json({ errorMessage: "all fields are not complete" });
    return;
  }

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/gm;

  if (passwordRegex.test(password) === false) {
    res.status(400).json({ errorMessage: "Password must be 8-20 characters with uppercase, lowercase, and numbers" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      res.status(400).json({ errorMessage: "User already exists" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const response = await User.create({
      email: email,
      password: hashPassword,
      username: username,
    });
    
    const token = jwt.sign({ _id: response._id }, process.env.JWT_SECRET || "secret");
    res.status(201).json({ authToken: token });
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ errorMessage: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ errorMessage: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ errorMessage: "Incorrect password" });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "secret");
    res.status(200).json({ authToken: token });
  } catch (error) {
    next(error);
  }
});

// GET /auth/verify
router.get("/verify", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ errorMessage: "Token not provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded._id);
    
    if (!user) {
      res.status(404).json({ errorMessage: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ errorMessage: "Invalid token" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;