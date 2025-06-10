import jwt from "jsonwebtoken";
import { Users } from "../models/auth-model.js";

export const verifyToken = async (request, h) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return h.response({ message: "Unauthorized: Token tidak ditemukan" }).code(401).takeover();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.auth = { credentials: decoded };
        return h.continue;
    } catch (err) {
        return h.response({ message: "Forbidden: Token tidak valid" }).code(403).takeover();
    }
};
