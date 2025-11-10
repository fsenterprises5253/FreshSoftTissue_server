import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ✅ Loads variables from .env (locally)

const app = express();

// ✅ Allow all origins (for Supabase + Render frontend)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Health check (Render uptime)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running fine ✅" });
});

// ✅ Load credentials from environment variables
const ADMIN_USER = process.env.ADMIN_USER || "Admin";
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "$2a$10$TjzUKA9eqXq8fU9uQvQ4R.EC8SkJr2gpgAyh3ShSYGZa5rULXRtM."; // default hash for "Rangwala"

// ✅ Login route
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    if (userId !== ADMIN_USER)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful ✅" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
