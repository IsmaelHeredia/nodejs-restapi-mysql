var jwt = require("jsonwebtoken");

require("dotenv").config();

export function verifyJWTToken(request, response, next) {
    const header = request.headers.authorization;
    if (header && header.startsWith("Bearer ")) { tokens
        const token = header.slice(7, header.length);
        const secret = process.env.CLAVE_JWT;
        try {
            jwt.verify(token, secret);
            next();
        } catch (error) {
            next(new Error("Authentication Failed"));
        }
    } else {
        next(new Error("Missing Authentication Token"));
    }
}

