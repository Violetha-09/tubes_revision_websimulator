const { PrismaClient } = require('../../generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const isPasswordPlaceholder = (url) => {
  return !url || url.includes('[YOUR-PASSWORD]');
};

let prisma = null;
const dbUrl = process.env.DATABASE_URL;

if (!isPasswordPlaceholder(dbUrl)) {
  try {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } catch (e) {
    console.error("Failed to initialize Prisma Client:", e.message);
  }
}

module.exports = prisma;
