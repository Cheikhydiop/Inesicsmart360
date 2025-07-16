"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/dashboardRoutes.ts
const express_1 = __importDefault(require("express"));
const DashboardController_1 = __importDefault(require("../controllers/DashboardController"));
const router = express_1.default.Router();
// Route principale pour récupérer toutes les données du dashboard
router.get('/', DashboardController_1.default.getDashboardData);
// Routes pour les données complètes du dashboard avec userId en paramètre
router.get('/user/:userId', DashboardController_1.default.getDashboardData);
// Routes pour les projets
router.get('/projects', DashboardController_1.default.getProjectsByUser);
router.get('/projects/user/:userId', DashboardController_1.default.getProjectsByUser);
// router.get('/projects/stats', DashboardController.getProjectsStats);
// Routes pour les tâches
router.get('/tasks', DashboardController_1.default.getTasksByUser);
// router.get('/tasks/recent', DashboardController.getRecentTasks);
// router.get('/tasks/:userId', DashboardController.getTasksStats);
// Routes pour les demandes
// Route avec paramètre dynamique
router.get('/requests/recent/:organizationId', DashboardController_1.default.getRecentRequests);
// router.get('/requests/:userId', DashboardController.getRequestsStats);
// Routes pour les utilisateurs
router.get('/users/organization', DashboardController_1.default.getUsersBySameOrganization);
router.get('/users/organization/:userId', DashboardController_1.default.getUsersBySameOrganization);
// Route pour les KPIs
// router.get('/kpis', DashboardController.getKPIs);
exports.default = router;
