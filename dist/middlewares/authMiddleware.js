"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ message: 'No authorization header provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    if ((0, tokenBlacklist_1.isBlacklisted)(token)) {
        res.status(401).json({ message: 'Token is no longer valid' });
        return;
    }
    try {
        const payload = (0, tokenUtils_1.verifyToken)(token);
        if (typeof payload === 'object' && 'userId' in payload) {
            req.userId = payload.userId;
            req.userType = payload.type;
            next(); // ✅ continue vers la prochaine route
        }
        else {
            res.status(401).json({ message: 'Invalid token structure' });
        }
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
