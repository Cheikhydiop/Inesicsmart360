// routes/dashboardRoutes.ts

import express from 'express';

import DashboardController from '../controllers/DashboardController';

const router = express.Router();

/**

* @swagger

* components:

*   schemas:

*     DashboardData:

*       type: object

*       properties:

*         projects:

*           type: array

*           items:

*             $ref: '#/components/schemas/Project'

*         tasks:

*           type: array

*           items:

*             $ref: '#/components/schemas/Task'

*         users:

*           type: array

*           items:

*             $ref: '#/components/schemas/User'

*         requests:

*           type: array

*           items:

*             $ref: '#/components/schemas/Request'

*

*     Project:

*       type: object

*       properties:

*         id:

*           type: string

*           description: ID unique du projet

*         name:

*           type: string

*           description: Nom du projet

*         description:

*           type: string

*           description: Description du projet

*         status:

*           type: string

*           enum: [active, completed, paused]

*           description: Statut du projet

*         userId:

*           type: string

*           description: ID de l'utilisateur propriétaire

*         createdAt:

*           type: string

*           format: date-time

*           description: Date de création

*

*     Task:

*       type: object

*       properties:

*         id:

*           type: string

*           description: ID unique de la tâche

*         title:

*           type: string

*           description: Titre de la tâche

*         description:

*           type: string

*           description: Description de la tâche

*         status:

*           type: string

*           enum: [pending, in_progress, completed]

*           description: Statut de la tâche

*         priority:

*           type: string

*           enum: [low, medium, high, urgent]

*           description: Priorité de la tâche

*         userId:

*           type: string

*           description: ID de l'utilisateur assigné

*         projectId:

*           type: string

*           description: ID du projet associé

*         dueDate:

*           type: string

*           format: date-time

*           description: Date d'échéance

*         createdAt:

*           type: string

*           format: date-time

*           description: Date de création

*

*     User:

*       type: object

*       properties:

*         id:

*           type: string

*           description: ID unique de l'utilisateur

*         name:

*           type: string

*           description: Nom de l'utilisateur

*         email:

*           type: string

*           format: email

*           description: Email de l'utilisateur

*         role:

*           type: string

*           description: Rôle de l'utilisateur

*         organizationId:

*           type: string

*           description: ID de l'organisation

*         createdAt:

*           type: string

*           format: date-time

*           description: Date de création

*

*     Request:

*       type: object

*       properties:

*         id:

*           type: string

*           description: ID unique de la demande

*         title:

*           type: string

*           description: Titre de la demande

*         description:

*           type: string

*           description: Description de la demande

*         status:

*           type: string

*           enum: [pending, approved, rejected]

*           description: Statut de la demande

*         userId:

*           type: string

*           description: ID de l'utilisateur demandeur

*         organizationId:

*           type: string

*           description: ID de l'organisation

*         createdAt:

*           type: string

*           format: date-time

*           description: Date de création

*

*     Error:

*       type: object

*       properties:

*         message:

*           type: string

*           description: Message d'erreur

*         code:

*           type: integer

*           description: Code d'erreur

*/

/**

* @swagger


router.get('/', DashboardController.getDashboardData);

/**

* @swagger

* /api/dashboard/user/{userId}:

*   get:

*     summary: Récupère les données du dashboard pour un utilisateur spécifique

*     description: Retourne les données complètes du dashboard pour l'utilisateur spécifié

*     tags: [Dashboard]

*     security:

*       - bearerAuth: []

*     parameters:

*       - in: path

*         name: userId

*         required: true

*         description: ID de l'utilisateur

*         schema:

*           type: string

*     responses:

*       200:

*         description: Données du dashboard récupérées avec succès

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/DashboardData'

*       401:

*         description: Non autorisé - Token invalide

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       404:

*         description: Utilisateur non trouvé

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       500:

*         description: Erreur interne du serveur

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*/

router.get('/user/:userId', DashboardController.getDashboardData);

/**

* @swagger



router.get('/projects', DashboardController.getProjectsByUser);

/**

* @swagger

* /api/dashboard/projects/user/{userId}:

*   get:

*     summary: Récupère les projets d'un utilisateur spécifique

*     description: Retourne la liste des projets pour l'utilisateur spécifié

*     tags: [Dashboard, Projects]

*     security:

*       - bearerAuth: []

*     parameters:

*       - in: path

*         name: userId

*         required: true

*         description: ID de l'utilisateur

*         schema:

*           type: string

*     responses:

*       200:

*         description: Projets récupérés avec succès

*         content:

*           application/json:

*             schema:

*               type: array

*               items:

*                 $ref: '#/components/schemas/Project'

*       401:

*         description: Non autorisé - Token invalide

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       404:

*         description: Utilisateur non trouvé

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       500:

*         description: Erreur interne du serveur

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*/

router.get('/projects/user/:userId', DashboardController.getProjectsByUser);


router.get('/tasks', DashboardController.getTasksByUser);

/**

* @swagger

* /api/dashboard/requests/recent/{organizationId}:

*   get:

*     summary: Récupère les demandes récentes d'une organisation

*     description: Retourne la liste des demandes récentes pour l'organisation spécifiée

*     tags: [Dashboard, Requests]

*     security:

*       - bearerAuth: []

*     parameters:

*       - in: path

*         name: organizationId

*         required: true

*         description: ID de l'organisation

*         schema:

*           type: string

*     responses:

*       200:

*         description: Demandes récentes récupérées avec succès

*         content:

*           application/json:

*             schema:

*               type: array

*               items:

*                 $ref: '#/components/schemas/Request'

*       401:

*         description: Non autorisé - Token invalide

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       404:

*         description: Organisation non trouvée

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       500:

*         description: Erreur interne du serveur

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*/

router.get('/requests/recent/:organizationId', DashboardController.getRecentRequests);


router.get('/users/organization', DashboardController.getUsersBySameOrganization);

/**

* @swagger

* /api/dashboard/users/organization/{userId}:

*   get:

*     summary: Récupère les utilisateurs de la même organisation qu'un utilisateur spécifique

*     description: Retourne la liste des utilisateurs appartenant à la même organisation que l'utilisateur spécifié

*     tags: [Dashboard, Users]

*     security:

*       - bearerAuth: []

*     parameters:

*       - in: path

*         name: userId

*         required: true

*         description: ID de l'utilisateur de référence

*         schema:

*           type: string

*     responses:

*       200:

*         description: Utilisateurs récupérés avec succès

*         content:

*           application/json:

*             schema:

*               type: array

*               items:

*                 $ref: '#/components/schemas/User'

*       401:

*         description: Non autorisé - Token invalide

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       404:

*         description: Utilisateur non trouvé

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*       500:

*         description: Erreur interne du serveur

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Error'

*/

router.get('/users/organization/:userId', DashboardController.getUsersBySameOrganization);

export default router;


