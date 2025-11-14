const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

// Log incoming requests and detect aborted connections early
app.use((req, res, next) => {
  console.log(`--> [wallet-service] ${req.method} ${req.url} from ${req.ip}`);
  req.on("aborted", () => {
    console.warn(`*** [wallet-service] request aborted: ${req.method} ${req.url} from ${req.ip}`);
  });
  next();
});

// Accept larger payloads if needed and keep JSON parsing errors manageable
app.use(express.json({ limit: "1mb" }));

// Database setup
const dbPath = path.join(__dirname, "../../database/ewallet.db");
const db = new sqlite3.Database(dbPath);

// Middleware untuk extract user ID dari header
const getUserId = (req, res, next) => {
  const userId = req.headers["x-user-id"] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID is required" });
  }
  const parsed = parseInt(userId, 10);
  if (Number.isNaN(parsed)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  req.userId = parsed;
  next();
};

// Get wallet balance
app.get("/balance", getUserId, (req, res) => {
  db.get("SELECT * FROM wallets WHERE user_id = ?", [req.userId], (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!wallet) {
      // Create wallet if doesn't exist
      db.run("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [req.userId, 0], function (err) {
        if (err) {
          console.error("[wallet-service] error creating wallet:", err.message);
          return res.status(500).json({ error: err.message });
        }
        return res.json({ user_id: req.userId, balance: 0, currency: "IDR" });
      });
    } else {
      const bal = parseFloat(wallet.balance) || 0;
      res.json({ user_id: wallet.user_id, balance: bal, currency: "IDR" });
    }
  });
});

// Top up wallet
app.post("/topup", getUserId, (req, res) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: "Amount is required" });
  }
  const numAmount = parseFloat(amount);
  if (Number.isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }

  // Start transaction
  db.run("BEGIN TRANSACTION", (beginErr) => {
    if (beginErr) {
      console.error("[wallet-service] BEGIN TRANSACTION error:", beginErr.message);
      return res.status(500).json({ error: beginErr.message });
    }

    db.get("SELECT * FROM wallets WHERE user_id = ?", [req.userId], (err, wallet) => {
      if (err) {
        console.error("[wallet-service] select wallet error:", err.message);
        db.run("ROLLBACK", () => {});
        return res.status(500).json({ error: err.message });
      }

      if (!wallet) {
        // Create wallet if doesn't exist
        db.run("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [req.userId, numAmount], function (insertErr) {
          if (insertErr) {
            console.error("[wallet-service] insert wallet error:", insertErr.message);
            db.run("ROLLBACK", () => {});
            return res.status(500).json({ error: insertErr.message });
          }
          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error("[wallet-service] commit error:", commitErr.message);
              return res.status(500).json({ error: commitErr.message });
            }
            res.json({ message: "Top up successful", user_id: req.userId, new_balance: numAmount });
          });
        });
      } else {
        const current = parseFloat(wallet.balance) || 0;
        const newBalance = current + numAmount;
        db.run("UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [newBalance, req.userId], (updateErr) => {
          if (updateErr) {
            console.error("[wallet-service] update wallet error:", updateErr.message);
            db.run("ROLLBACK", () => {});
            return res.status(500).json({ error: updateErr.message });
          }
          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error("[wallet-service] commit error:", commitErr.message);
              return res.status(500).json({ error: commitErr.message });
            }
            res.json({ message: "Top up successful", user_id: req.userId, new_balance: newBalance });
          });
        });
      }
    });
  });
});

// Deduct from wallet (for payments)
app.post("/deduct", getUserId, (req, res) => {
  const { amount } = req.body;
  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: "Amount is required" });
  }
  const numAmount = parseFloat(amount);
  if (Number.isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }

  db.run("BEGIN TRANSACTION", (beginErr) => {
    if (beginErr) {
      console.error("[wallet-service] BEGIN TRANSACTION error:", beginErr.message);
      return res.status(500).json({ error: beginErr.message });
    }

    db.get("SELECT * FROM wallets WHERE user_id = ?", [req.userId], (err, wallet) => {
      if (err) {
        console.error("[wallet-service] select wallet error:", err.message);
        db.run("ROLLBACK", () => {});
        return res.status(500).json({ error: err.message });
      }

      if (!wallet) {
        db.run("ROLLBACK", () => {});
        return res.status(404).json({ error: "Wallet not found" });
      }

      const current = parseFloat(wallet.balance) || 0;
      if (current < numAmount) {
        db.run("ROLLBACK", () => {});
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const newBalance = current - numAmount;
      db.run("UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [newBalance, req.userId], (updateErr) => {
        if (updateErr) {
          console.error("[wallet-service] update wallet error:", updateErr.message);
          db.run("ROLLBACK", () => {});
          return res.status(500).json({ error: updateErr.message });
        }
        db.run("COMMIT", (commitErr) => {
          if (commitErr) {
            console.error("[wallet-service] commit error:", commitErr.message);
            return res.status(500).json({ error: commitErr.message });
          }
          res.json({ message: "Deduction successful", user_id: req.userId, new_balance: newBalance });
        });
      });
    });
  });
});

// Transfer: atomic deduct from sender and credit recipient, and record transaction
app.post("/transfer", getUserId, (req, res) => {
  const { recipientId, amount, description } = req.body;
  const recipient = parseInt(recipientId, 10);
  const amt = parseFloat(amount);

  if (Number.isNaN(recipient) || recipient <= 0) {
    return res.status(400).json({ error: "Valid recipientId is required" });
  }
  if (Number.isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }
  if (recipient === req.userId) {
    return res.status(400).json({ error: "Cannot transfer to yourself" });
  }

  db.run("BEGIN TRANSACTION", (beginErr) => {
    if (beginErr) {
      console.error("[wallet-service] BEGIN TRANSACTION error:", beginErr.message);
      return res.status(500).json({ error: beginErr.message });
    }

    // Get sender wallet
    db.get("SELECT * FROM wallets WHERE user_id = ?", [req.userId], (err, senderWallet) => {
      if (err) {
        console.error("[wallet-service] select sender wallet error:", err.message);
        db.run("ROLLBACK", () => {});
        return res.status(500).json({ error: err.message });
      }
      if (!senderWallet) {
        db.run("ROLLBACK", () => {});
        return res.status(404).json({ error: "Sender wallet not found" });
      }

      const senderBal = parseFloat(senderWallet.balance) || 0;
      if (senderBal < amt) {
        db.run("ROLLBACK", () => {});
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Get recipient wallet (if any)
      db.get("SELECT * FROM wallets WHERE user_id = ?", [recipient], (rErr, recipientWallet) => {
        if (rErr) {
          console.error("[wallet-service] select recipient wallet error:", rErr.message);
          db.run("ROLLBACK", () => {});
          return res.status(500).json({ error: rErr.message });
        }

        const recipientBal = recipientWallet ? parseFloat(recipientWallet.balance) || 0 : 0;

        const newSenderBal = senderBal - amt;
        const newRecipientBal = recipientBal + amt;

        // Update sender balance
        db.run("UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [newSenderBal, req.userId], (uErr) => {
          if (uErr) {
            console.error("[wallet-service] update sender error:", uErr.message);
            db.run("ROLLBACK", () => {});
            return res.status(500).json({ error: uErr.message });
          }

          // If recipient wallet exists update, otherwise insert
          const finishRecipientUpdate = () => {
            // Insert transaction record
            db.run("INSERT INTO transactions (sender_id, recipient_id, amount, description, status) VALUES (?, ?, ?, ?, ?)", [req.userId, recipient, amt, description || "Payment", "completed"], function (txErr) {
              if (txErr) {
                console.error("[wallet-service] insert transaction error:", txErr.message);
                db.run("ROLLBACK", () => {});
                return res.status(500).json({ error: txErr.message });
              }

              // Commit
              db.run("COMMIT", (cErr) => {
                if (cErr) {
                  console.error("[wallet-service] commit error:", cErr.message);
                  return res.status(500).json({ error: cErr.message });
                }
                return res.json({ message: "Transfer successful", transaction_id: this.lastID, sender: { user_id: req.userId, new_balance: newSenderBal }, recipient: { user_id: recipient, new_balance: newRecipientBal } });
              });
            });
          };

          if (recipientWallet) {
            db.run("UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [newRecipientBal, recipient], (ruErr) => {
              if (ruErr) {
                console.error("[wallet-service] update recipient error:", ruErr.message);
                db.run("ROLLBACK", () => {});
                return res.status(500).json({ error: ruErr.message });
              }
              finishRecipientUpdate();
            });
          } else {
            db.run("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [recipient, newRecipientBal], (insErr) => {
              if (insErr) {
                console.error("[wallet-service] insert recipient wallet error:", insErr.message);
                db.run("ROLLBACK", () => {});
                return res.status(500).json({ error: insErr.message });
              }
              finishRecipientUpdate();
            });
          }
        });
      });
    });
  });
});

// Get wallet details
app.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  db.get("SELECT * FROM wallets WHERE user_id = ?", [userId], (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    res.json({
      user_id: wallet.user_id,
      balance: parseFloat(wallet.balance) || 0,
      currency: "IDR",
    });
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "wallet-service" });
});

app.listen(PORT, () => {
  console.log(`💰 Wallet Service running on port ${PORT}`);
});

// Error handler for JSON/body parse errors and aborted requests
app.use((err, req, res, next) => {
  console.error("*** [wallet-service] error handler caught:", err && err.message ? err.message : err);
  if (res.headersSent) return next(err);
  // Handle invalid JSON body parse errors from body-parser/raw-body
  if (err && (err.type === "entity.parse.failed" || (err instanceof SyntaxError && err.message && err.message.toLowerCase().includes("json")))) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large" });
  }
  if (err && err.message && err.message.toLowerCase().includes("request aborted")) {
    return res.status(400).json({ error: "Request aborted by client" });
  }
  res.status(err && err.status ? err.status : 500).json({ error: err && err.message ? err.message : "Internal server error" });
});
