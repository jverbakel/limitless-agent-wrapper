import express from "express";
import fetch from "node-fetch";

const app = express();

// --- Security Layer (Query or Header) ---
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.auth;
  const token = process.env.ACCESS_TOKEN;

  if (authHeader === `Bearer ${token}` || authQuery === token) {
    return next();
  }

  console.log("🚫 Unauthorized request blocked");
  return res.status(403).send("Forbidden");
});

// -----------------------

// Health check
app.get("/", (req, res) => {
  res.send("✅ Limitless Agent is running securely on Render.");
});

// Example endpoint to test connection
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "Authorized connection successful" });
});

// Example endpoint to call Limitless API
app.get("/api/chats", async (req, res) => {
  try {
    const response = await fetch("https://api.limitless.ai/v1/chats", {
      headers: { Authorization: `Bearer ${process.env.LIMITLESS_API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to connect to Limitless API" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🌐 Server running securely on port ${port}`));
