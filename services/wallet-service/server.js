const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, '../../database/ewallet.db');
const db = new sqlite3.Database(dbPath);

// Middleware untuk extract user ID dari header
const getUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }
  req.userId = userId;
  next();
};

// Get wallet balance
app.get('/balance', getUserId, (req, res) => {
  db.get('SELECT * FROM wallets WHERE user_id = ?', [req.userId], (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!wallet) {
      // Create wallet if doesn't exist
      db.run('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [req.userId, 0], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.json({ user_id: parseInt(req.userId), balance: 0, currency: 'IDR' });
      });
    } else {
      res.json({
        user_id: wallet.user_id,
        balance: wallet.balance,
        currency: 'IDR'
      });
    }
  });
});

// Top up wallet
app.post('/topup', getUserId, (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.get('SELECT * FROM wallets WHERE user_id = ?', [req.userId], (err, wallet) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      if (!wallet) {
        // Create wallet if doesn't exist
        db.run('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', [req.userId, amount], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          db.run('COMMIT');
          res.json({
            message: 'Top up successful',
            user_id: parseInt(req.userId),
            new_balance: amount
          });
        });
      } else {
        const newBalance = wallet.balance + amount;
        db.run('UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [newBalance, req.userId], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          db.run('COMMIT');
          res.json({
            message: 'Top up successful',
            user_id: parseInt(req.userId),
            new_balance: newBalance
          });
        });
      }
    });
  });
});

// Deduct from wallet (for payments)
app.post('/deduct', getUserId, (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.get('SELECT * FROM wallets WHERE user_id = ?', [req.userId], (err, wallet) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      if (!wallet) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: 'Wallet not found' });
      }

      if (wallet.balance < amount) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      const newBalance = wallet.balance - amount;
      db.run('UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [newBalance, req.userId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        db.run('COMMIT');
        res.json({
          message: 'Deduction successful',
          user_id: parseInt(req.userId),
          new_balance: newBalance
        });
      });
    });
  });
});

// Get wallet details
app.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  db.get('SELECT * FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({
      user_id: wallet.user_id,
      balance: wallet.balance,
      currency: 'IDR'
    });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wallet-service' });
});

app.listen(PORT, () => {
  console.log(`💰 Wallet Service running on port ${PORT}`);
});

