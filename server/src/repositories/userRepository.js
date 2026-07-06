const prisma = require('../config/prisma');

class UserRepository {
    async findByUsername(username) {
        if (!prisma) return null;
        return await prisma.user.findUnique({
            where: { username }
        });
    }

    async findById(id) {
        if (!prisma) return null;
        return await prisma.user.findUnique({
            where: { id: parseInt(id, 10) }
        });
    }

    async create(username, hashedPassword, role = 'User') {
        if (!prisma) {
            return { id: Date.now(), username, role };
        }
        return await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });
    }
}

module.exports = new UserRepository();
