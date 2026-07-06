const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');

class AuthService {
    async register(username, password) {
        const existing = await userRepository.findByUsername(username);
        if (existing) {
            const err = new Error('Username already exists');
            err.statusCode = 400;
            throw err;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return await userRepository.create(username, hashedPassword, 'User');
    }

    async login(username, password) {
        const user = await userRepository.findByUsername(username);
        if (!user) {
            const err = new Error('Invalid username or password');
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid username or password');
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            env.JWT.SECRET,
            { expiresIn: env.JWT.EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();
