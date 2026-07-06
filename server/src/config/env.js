require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DB: {
        HOST: process.env.DB_HOST || '127.0.0.1',
        USER: process.env.DB_USER || 'root',
        PASSWORD: process.env.DB_PASSWORD || '',
        NAME: process.env.DB_NAME || 'wc_simulator_db',
        PORT: parseInt(process.env.DB_PORT || '3306', 10),
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'supersecretjwtkeywc2026',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
    }
};
