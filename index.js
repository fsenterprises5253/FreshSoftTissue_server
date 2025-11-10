import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();

// ✅ Allow all origins (for Render frontend or Supabase)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Health check (for Render uptime)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running fine ✅" });
});

// ✅ Simulated user data — FIXED: use static hash instead of regenerating each time
// Password = "Rangwala"
const USERS = [
  {
    userId: "Admin",
    passwordHash:
      "$2a$10$TjzUKA9eqXq8fU9uQvQ4R.EC8SkJr2gpgAyh3ShSYGZa5rULXRtM.", // 🔒 Static hash for "Rangwala"
  },
];

// ✅ Login route
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = USERS.find((u) => u.userId === userId);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
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
