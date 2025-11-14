const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "ewallet.db");

// Attempt to remove existing database if it exists. If it's locked, continue without deleting.
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log("Removed existing database");
  } catch (err) {
    console.warn("Could not remove existing database (it may be in use):", err.message);
    console.warn("Proceeding to open the existing database and seed missing data.");
  }
}

const db = new sqlite3.Database(dbPath);

// Read and execute schema
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema, (err) => {
  if (err) {
    console.error("Error creating schema:", err);
    process.exit(1);
  }
  console.log("Schema created successfully");

  // Seed data
  seedData();
});

async function seedData() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Insert users (idempotent)
  const users = [
    { username: "alice", email: "alice@example.com", password: hashedPassword, fullName: "Alice Johnson" },
    { username: "bob", email: "bob@example.com", password: hashedPassword, fullName: "Bob Smith" },
    { username: "charlie", email: "charlie@example.com", password: hashedPassword, fullName: "Charlie Brown" },
  ];

  db.serialize(() => {
    users.forEach((user, index) => {
      // Check if user exists
      db.get("SELECT id FROM users WHERE username = ? OR email = ?", [user.username, user.email], (err, row) => {
        if (err) {
          console.error(`Error checking user ${user.username}:`, err);
          return;
        }

        const handleWallet = (userId) => {
          const initialBalance = (index + 1) * 100000; // 100k, 200k, 300k
          // Create wallet if it doesn't exist
          db.run("INSERT OR IGNORE INTO wallets (user_id, balance) VALUES (?, ?)", [userId, initialBalance], (walletErr) => {
            if (walletErr) {
              console.error(`Error creating wallet for ${user.username}:`, walletErr);
            } else {
              console.log(`Ensured wallet exists for ${user.username} with balance: ${initialBalance}`);
            }
          });
        };

        if (row && row.id) {
          console.log(`User ${user.username} already exists with ID: ${row.id}`);
          handleWallet(row.id);
        } else {
          db.run("INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)", [user.username, user.email, user.password, user.fullName], function (insertErr) {
            if (insertErr) {
              console.error(`Error inserting user ${user.username}:`, insertErr);
            } else {
              console.log(`User ${user.username} created with ID: ${this.lastID}`);
              handleWallet(this.lastID);
            }
          });
        }
      });
    });

    // Wait a bit for users to be created, then create sample transactions
    setTimeout(() => {
      db.all("SELECT id FROM users", (err, userRows) => {
        if (err) {
          console.error("Error fetching users:", err);
          return;
        }

        if (userRows.length >= 2) {
          // Create sample transactions
          const transactions = [
            { sender_id: userRows[0].id, recipient_id: userRows[1].id, amount: 50000, description: "Payment for services" },
            { sender_id: userRows[1].id, recipient_id: userRows[0].id, amount: 25000, description: "Refund" },
            { sender_id: userRows[0].id, recipient_id: userRows[2].id, amount: 100000, description: "Gift payment" },
          ];

          transactions.forEach((tx) => {
            db.run("INSERT INTO transactions (sender_id, recipient_id, amount, description, status) VALUES (?, ?, ?, ?, ?)", [tx.sender_id, tx.recipient_id, tx.amount, tx.description, "completed"], (err) => {
              if (err) {
                console.error("Error inserting transaction:", err);
              } else {
                console.log(`Transaction created: ${tx.description}`);
              }
            });
          });
        }

        console.log("\n✅ Database seeded successfully!");
        console.log("\nSample users:");
        console.log("  - alice / password123");
        console.log("  - bob / password123");
        console.log("  - charlie / password123");
        db.close();
      });
    }, 500);
  });
}
