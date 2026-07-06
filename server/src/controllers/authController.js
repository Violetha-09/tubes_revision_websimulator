const authService = require('../services/authService');

class AuthController {
    async register(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await authService.register(username, password);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const data = await authService.login(username, password);
            
            res.cookie('token', data.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
