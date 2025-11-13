const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://localhost:3002';

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, '../../database/ewallet.db');
const db = new sqlite3.Database(dbPath);

// Helper function to call wallet service
const callWalletService = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': data?.userId || ''
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// Middleware untuk extract user ID
const getUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }
  req.userId = userId;
  next();
};

// Create payment/transaction
app.post('/payment', getUserId, async (req, res) => {
  const { recipientId, amount, description } = req.body;
  
  if (!recipientId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Recipient ID and valid amount are required' });
  }

  if (parseInt(req.userId) === parseInt(recipientId)) {
    return res.status(400).json({ error: 'Cannot send payment to yourself' });
  }

  try {
    // Check sender balance
    const senderBalance = await callWalletService('GET', `/balance?userId=${req.userId}`, { userId: req.userId });
    if (!senderBalance.balance || senderBalance.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check recipient wallet exists
    const recipientWallet = await callWalletService('GET', `/balance?userId=${recipientId}`, { userId: recipientId });
    if (!recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }

    try {
      // Deduct from sender
      const deductResult = await callWalletService('POST', '/deduct', { userId: req.userId, amount: amount });
      if (deductResult.error) {
        return res.status(400).json({ error: deductResult.error });
      }

      // Add to recipient
      const topupResult = await callWalletService('POST', '/topup', { userId: recipientId, amount: amount });
      if (topupResult.error) {
        // Rollback: add back to sender
        await callWalletService('POST', '/topup', { userId: req.userId, amount: amount });
        return res.status(500).json({ error: 'Failed to credit recipient' });
      }

      // Create transaction record
      db.run(
        'INSERT INTO transactions (sender_id, recipient_id, amount, description, status) VALUES (?, ?, ?, ?, ?)',
        [req.userId, recipientId, amount, description || 'Payment', 'completed'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({
            message: 'Payment successful',
            transaction: {
              id: this.lastID,
              sender_id: parseInt(req.userId),
              recipient_id: parseInt(recipientId),
              amount: amount,
              description: description || 'Payment',
              status: 'completed',
              created_at: new Date().toISOString()
            }
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message || 'Transaction failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history
app.get('/history', getUserId, (req, res) => {
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
        total: transactions.length
      });
    }
  );
});

// Get transaction by ID
app.get('/:transactionId', getUserId, (req, res) => {
  const transactionId = req.params.transactionId;
  db.get(
    'SELECT * FROM transactions WHERE id = ? AND (sender_id = ? OR recipient_id = ?)',
    [transactionId, req.userId, req.userId],
    (err, transaction) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    }
  );
});

// Get all transactions (for admin/testing)
app.get('/', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100', (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(transactions);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transaction-service' });
});

app.listen(PORT, () => {
  console.log(`💳 Transaction Service running on port ${PORT}`);
});

