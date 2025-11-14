const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3004;
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:3002";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// simple middleware to extract x-user-id
const getUserId = (req, res, next) => {
  const userId = req.headers["x-user-id"] || req.query.userId;
  if (!userId) return res.status(401).json({ error: "User ID is required" });
  const parsed = parseInt(userId, 10);
  if (Number.isNaN(parsed)) return res.status(400).json({ error: "Invalid user ID" });
  req.userId = parsed;
  next();
};

// Health
app.get("/health", (req, res) => res.json({ status: "ok", service: "payment-service" }));

// POST /payment -> validate and call wallet-service /transfer
app.post("/payment", getUserId, async (req, res) => {
  try {
    const { recipientId, amount, description } = req.body;
    const recipient = parseInt(recipientId, 10);
    const amountNum = parseFloat(amount);
    if (Number.isNaN(recipient) || recipient <= 0) return res.status(400).json({ error: "Valid recipientId is required" });
    if (Number.isNaN(amountNum) || amountNum <= 0) return res.status(400).json({ error: "Valid amount is required" });
    if (recipient === req.userId) return res.status(400).json({ error: "Cannot send payment to yourself" });

    const url = `${WALLET_SERVICE_URL}/transfer`;
    console.log(`--> [payment-service] POST ${url} caller=${req.userId} payload=${JSON.stringify({ recipient, amount: amountNum })}`);

    const resp = await axios.post(url, { recipientId: recipient, amount: amountNum, description: description || "Payment" }, { headers: { "x-user-id": String(req.userId), "Content-Type": "application/json" }, timeout: 120000 });
    return res.status(resp.status || 200).json(resp.data);
  } catch (err) {
    console.error("*** [payment-service] error:", err && err.message ? err.message : err);
    if (err.response && err.response.data) return res.status(err.response.status || 502).json(err.response.data);
    if (err.code === "ECONNABORTED") return res.status(504).json({ error: "Upstream timeout" });
    return res.status(502).json({ error: err.message || "Payment service error" });
  }
});

app.listen(PORT, () => console.log(`💸 Payment Service running on port ${PORT}`));
