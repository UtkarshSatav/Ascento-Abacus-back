'use strict';

// Load & validate environment variables before anything else
require('./config/env');

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seeder');
const logger = require('./utils/logger');
const env = require('./config/env');

const bootstrap = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Seed default admin (no-op if already exists)
  await seedAdmin();

  // 3. Start HTTP server
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // ─── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force-kill after 10 s if connections linger
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    shutdown('uncaughtException');
  });
};

bootstrap().catch((err) => {
  // Fatal startup error (e.g. DB unreachable, bad env var)
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
