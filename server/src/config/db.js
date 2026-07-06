const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    port: env.DB.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('🚀 Connected to MySQL database successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Failed to connect to MySQL database:', error.message);
    }
})();

module.exports = pool;
