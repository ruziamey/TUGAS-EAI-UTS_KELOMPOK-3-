const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const http = require("http");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:3002";

app.use(cors());
// Log incoming requests and detect aborted connections early
app.use((req, res, next) => {
  console.log(`--> [transaction-service] ${req.method} ${req.url} from ${req.ip}`);
  req.on("aborted", () => {
    console.warn(`*** [transaction-service] request aborted: ${req.method} ${req.url} from ${req.ip}`);
  });
  next();
});

// Accept larger payloads if needed and keep JSON parsing errors manageable
app.use(express.json({ limit: "1mb" }));

// Database setup
const dbPath = path.join(__dirname, "../../database/ewallet.db");
const db = new sqlite3.Database(dbPath);

// Helper function to call wallet service using axios (simpler and less error-prone)
const callWalletService = async (method, path, data = null, extraHeaders = {}) => {
  try {
    const url = `${WALLET_SERVICE_URL}${path}`;
    console.log(`--> [transaction-service] calling wallet: ${method} ${url} data=${JSON.stringify(data)} headers=${JSON.stringify(extraHeaders)}`);
    const opts = {
      method: method,
      url,
      headers: { "Content-Type": "application/json", ...extraHeaders },
      timeout: 120000,
      data: data || undefined,
    };
    const resp = await axios(opts);
    return resp.data;
  } catch (err) {
    console.error("*** [transaction-service] callWalletService error:", err && err.message ? err.message : err);
    // normalize error to object with error message
    if (err.code === "ECONNABORTED") return { error: "wallet service timeout" };
    if (err.response && err.response.data) return err.response.data;
    return { error: err.message || "wallet service error" };
  }
};

// Middleware untuk extract user ID
const getUserId = (req, res, next) => {
  const userId = req.headers["x-user-id"] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID is required" });
  }
  const parsed = parseInt(userId, 10);
  if (Number.isNaN(parsed)) return res.status(400).json({ error: "Invalid user ID" });
  req.userId = parsed;
  next();
};

// Create payment/transaction
app.post("/payment", getUserId, async (req, res) => {
  const { recipientId, amount, description } = req.body;
  const recipient = parseInt(recipientId, 10);
  const amountNum = parseFloat(amount);

  if (Number.isNaN(recipient) || recipient <= 0) {
    return res.status(400).json({ error: "Valid recipientId is required" });
  }
  if (Number.isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }
  if (parseInt(req.userId, 10) === recipient) {
    return res.status(400).json({ error: "Cannot send payment to yourself" });
  }

  try {
    if (req.aborted) return res.status(400).json({ error: "Request aborted by client" });

    // Pre-check saldo pengirim
    const senderBalanceResp = await callWalletService("GET", `/${req.userId}`);
    const senderBalNum = parseFloat(senderBalanceResp?.balance || 0);
    console.log("[transaction-service] sender balance check:", senderBalanceResp);

    if (senderBalNum < amountNum) {
      return res.status(400).json({ error: "Insufficient balance", balance: senderBalNum });
    }

    // Lanjutkan transfer ke wallet-service
    const transferPayload = { recipientId: recipient, amount: amountNum, description: description || "Payment" };
    const transferResp = await callWalletService("POST", "/transfer", transferPayload, { "x-user-id": String(req.userId) });
    console.log("[transaction-service] transfer response:", transferResp);

    if (!transferResp || transferResp.error) {
      const errMsg = transferResp?.error || "Transfer failed";
      const status = transferResp && transferResp.error && transferResp.error.toLowerCase().includes("insufficient") ? 400 : 502;
      return res.status(status).json({ error: errMsg });
    }

    return res.status(200).json({ message: transferResp.message || "Payment successful", transfer: transferResp });
  } catch (error) {
    console.error("[transaction-service] payment error:", error);
    res.status(500).json({ error: error && error.message ? error.message : "Internal error" });
  }
});

// Get transaction history
app.get("/history", getUserId, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    `SELECT * FROM transactions 
     WHERE sender_id = ? OR recipient_id = ? 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [req.userId, req.userId, limit, offset],
    (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        user_id: parseInt(req.userId),
        transactions: transactions,
        total: transactions.length,
      });
    }
  );
});

// Get transaction by ID
app.get("/:transactionId", getUserId, (req, res) => {
  const transactionId = req.params.transactionId;
  db.get("SELECT * FROM transactions WHERE id = ? AND (sender_id = ? OR recipient_id = ?)", [transactionId, req.userId, req.userId], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  });
});

// Get all transactions (for admin/testing)
app.get("/", (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100", (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(transactions);
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "transaction-service" });
});

// Global error handler: catch body parse errors and other unhandled errors
app.use((err, req, res, next) => {
  console.error("*** [transaction-service] global error handler:", err && err.message ? err.message : err);
  if (res.headersSent) return next(err);
  if (err && (err.type === "entity.parse.failed" || (err instanceof SyntaxError && err.message && err.message.toLowerCase().includes("json")))) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  if (err && err.code === "ECONNABORTED") {
    return res.status(502).json({ error: "Upstream timeout" });
  }
  res.status(err && err.status ? err.status : 500).json({ error: err && err.message ? err.message : "Internal server error" });
});

// Debug endpoint: check balances and numeric parsing without creating a transaction
app.post("/debug/payment-check", getUserId, async (req, res) => {
  const { recipientId, amount } = req.body;
  const recipient = parseInt(recipientId, 10);
  const amountNum = parseFloat(amount);
  if (Number.isNaN(recipient) || Number.isNaN(amountNum)) {
    return res.status(400).json({ error: "recipientId and numeric amount are required" });
  }

  try {
    const senderBalance = await callWalletService("GET", `/${req.userId}`);
    const recipientBalance = await callWalletService("GET", `/${recipient}`);
    const senderBalNum = parseFloat(senderBalance?.balance || 0);
    const recipientBalNum = parseFloat(recipientBalance?.balance || 0);
    const canProceed = senderBalNum >= amountNum;
    console.log("[transaction-service][debug] senderBalance:", senderBalance, "senderBalNum:", senderBalNum, "amountNum:", amountNum);
    console.log("[transaction-service][debug] recipientBalance:", recipientBalance, "recipientBalNum:", recipientBalNum);
    return res.json({
      sender: { raw: senderBalance, value: senderBalNum },
      recipient: { raw: recipientBalance, value: recipientBalNum },
      amount: amountNum,
      canProceed,
    });
  } catch (err) {
    console.error("[transaction-service][debug] error:", err);
    return res.status(500).json({ error: err && err.message ? err.message : "debug error" });
  }
});

app.listen(PORT, () => {
  console.log(`💳 Transaction Service running on port ${PORT}`);
});
