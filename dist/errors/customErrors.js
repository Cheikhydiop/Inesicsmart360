"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(messages) {
        // Joindre les messages si c'est un tableau, sinon laisser tel quel
        const message = Array.isArray(messages) ? messages.join(', ') : messages;
        super(message);
        this.name = 'ValidationError';
        // Stocker tous les messages dans un tableau pour usage ultérieur
        this.details = Array.isArray(messages) ? messages : [messages];
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
