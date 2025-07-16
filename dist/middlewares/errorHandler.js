"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("../errors/customErrors");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof customErrors_1.ValidationError) {
        res.status(400).json({
            type: 'ValidationError',
            message: err.message,
            details: err.details,
        });
        return; // juste return void
    }
    if (err instanceof customErrors_1.DatabaseError) {
        res.status(500).json({
            type: 'DatabaseError',
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        type: 'InternalServerError',
        message: 'Une erreur interne est survenue.',
    });
};
exports.default = errorHandler;
