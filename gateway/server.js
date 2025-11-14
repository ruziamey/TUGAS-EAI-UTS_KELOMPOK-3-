const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/api/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Service URLs
const USER_SERVICE = process.env.USER_SERVICE_URL || "http://localhost:3001";
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL || "http://localhost:3002";
const TRANSACTION_SERVICE = process.env.TRANSACTION_SERVICE_URL || "http://localhost:3003";
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || "http://localhost:3004";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", gateway: "running" });
});

// Proxy to User Service
app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
    proxyTimeout: 120000,
    timeout: 120000,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`--> [gateway] proxy req to user-service: ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`<-- [gateway] proxy res from user-service: ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("*** [gateway] proxy error to user-service:", err && err.message ? err.message : err);
      if (!res.headersSent) {
        res.status(502).json({ error: "Bad gateway" });
      }
    },
  })
);

// Proxy to Wallet Service
app.use(
  "/api/wallets",
  createProxyMiddleware({
    target: WALLET_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/wallets": "" },
    proxyTimeout: 120000,
    timeout: 120000,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`--> [gateway] proxy req to wallet-service: ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`<-- [gateway] proxy res from wallet-service: ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("*** [gateway] proxy error to wallet-service:", err && err.message ? err.message : err);
      if (!res.headersSent) {
        res.status(502).json({ error: "Bad gateway" });
      }
    },
  })
);

// Proxy to Transaction Service
app.use(
  "/api/transactions",
  createProxyMiddleware({
    target: TRANSACTION_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/transactions": "" },
    proxyTimeout: 120000,
    timeout: 120000,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`--> [gateway] proxy req to transaction-service: ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`<-- [gateway] proxy res from transaction-service: ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("*** [gateway] proxy error to transaction-service:", err && err.message ? err.message : err);
      if (!res.headersSent) {
        res.status(502).json({ error: "Bad gateway" });
      }
    },
  })
);

// Proxy to Payment Service
app.use(
  "/api/payments",
  createProxyMiddleware({
    target: PAYMENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/payments": "" },
    proxyTimeout: 120000,
    timeout: 120000,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`--> [gateway] proxy req to payment-service: ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`<-- [gateway] proxy res from payment-service: ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("*** [gateway] proxy error to payment-service:", err && err.message ? err.message : err);
      if (!res.headersSent) {
        res.status(502).json({ error: "Bad gateway" });
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`   User Service: ${USER_SERVICE}`);
  console.log(`   Wallet Service: ${WALLET_SERVICE}`);
  console.log(`   Transaction Service: ${TRANSACTION_SERVICE}`);
});
