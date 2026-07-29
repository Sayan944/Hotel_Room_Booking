import jwt from 'jsonwebtoken';

export const JWT_SECRET = 'hotel_secret_key_2026';

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

export function requireRole(...allowedRoles) {
    const roles = allowedRoles.flat();
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden. Requires ${roles.join(' or ')} credentials.` });
        }
        next();
    };
}
