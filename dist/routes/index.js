"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const userRoute_1 = __importDefault(require("./userRoute"));
const requestRoutes_1 = __importDefault(require("./requestRoutes"));
const providerRoutes_1 = __importDefault(require("./providerRoutes"));
const inventaireRoutes_1 = __importDefault(require("./inventaireRoutes"));
const projetRoutes_1 = __importDefault(require("./projetRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
function default_1(app) {
    app.use('/api/users', userRoute_1.default);
    app.use('/api/requests', requestRoutes_1.default);
    app.use('/api', providerRoutes_1.default);
    app.use('/api/users', userRoute_1.default);
    app.use('/api/requests', requestRoutes_1.default);
    app.use('/api/inventaire', inventaireRoutes_1.default);
    app.use('/api/equipements', inventaireRoutes_1.default);
    app.use('/api/projets', projetRoutes_1.default);
    app.use('/api/dashboard', dashboardRoutes_1.default);
}
