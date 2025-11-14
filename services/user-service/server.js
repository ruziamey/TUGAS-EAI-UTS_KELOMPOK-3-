const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
// Log incoming requests and detect aborted connections early
app.use((req, res, next) => {
  console.log(`--> [user-service] ${req.method} ${req.url} from ${req.ip}`);
  req.on("aborted", () => {
    console.warn(`*** [user-service] request aborted: ${req.method} ${req.url} from ${req.ip}`);
  });
  next();
});

// Accept larger payloads if needed and keep JSON parsing errors manageable
app.use(express.json({ limit: "1mb" }));

// Database setup
const dbPath = path.join(__dirname, "../../database/ewallet.db");
const db = new sqlite3.Database(dbPath);

// Middleware untuk verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Register user
app.post("/register", async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, fullName || null], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint")) {
          return res.status(409).json({ error: "Username or email already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      // Create a wallet for the new user with 0 balance
      db.run("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [this.lastID, 0.0], (walletErr) => {
        if (walletErr) {
          // If wallet creation fails, log but still return success for user creation
          console.error("Error creating wallet for new user:", walletErr.message);
        }
        const token = jwt.sign({ userId: this.lastID, username }, JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({
          message: "User registered successfully",
          user: { id: this.lastID, username, email, fullName },
          token,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email, fullName: user.full_name },
      token,
    });
  });
});

// Get current user profile
app.get("/profile", verifyToken, (req, res) => {
  db.get("SELECT id, username, email, full_name, created_at FROM users WHERE id = ?", [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });
});

// Get all users (for admin/testing)
app.get("/", (req, res) => {
  db.all("SELECT id, username, email, full_name, created_at FROM users", (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(users);
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});

// Error handler for body-parser / JSON parse errors and other runtime errors
app.use((err, req, res, next) => {
  console.error("*** [user-service] error handler caught:", err && err.message ? err.message : err);
  if (res.headersSent) return next(err);
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large" });
  }
  // raw-body may emit BadRequestError on aborted requests; respond gracefully
  if (err && err.message && err.message.toLowerCase().includes("request aborted")) {
    return res.status(400).json({ error: "Request aborted by client" });
  }
  res.status(err && err.status ? err.status : 500).json({ error: err && err.message ? err.message : "Internal server error" });
});
