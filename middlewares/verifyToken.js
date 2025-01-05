const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(request, response, next) {
    const token = request.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            request.user = decoded;
            console.log(request.user);
            next();
        } catch (error) {
            response.status(401).json({ message: 'Invalid Token' });
        }
    } else {
        // 401 -> UnAutherized
        response.status(401).json({ message: 'UnAuthorization' });
    }
}

// Verify Token & Authorize the user
function verifyTokenAndAuthorization(request, response, next) {
    verifyToken(request, response, () => {
        if (request.user.id === request.params.id || request.user.isAdmin) {
            next();
        } else {
            // 403 -> Forbidden not allowed
            response.status(403).json({ message: 'You are not allowed, you can update just your profile' });
        }
    });
}

// Verify Token & Admin
function verifyTokenAndAdmin(request, response, next) {
    verifyToken(request, response, () => {
        console.log(request.user.isAdmin);
        if (request.user.isAdmin) {
            next();
        } else {
            // 403 -> Forbidden not allowed
            response.status(403).json({ message: 'You are not allowed, only admin' });
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};