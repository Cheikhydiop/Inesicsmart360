// routes/projets.routes.ts
import express from 'express';
import { Router } from 'express';
import ProjetController from '../controllers/ProjetController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 *           description: ID de l'utilisateur propriétaire du projet
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du projet
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
 * /api/projects/{id}:
 *   get:
 *     summary: Récupère un projet spécifique
 *     description: Retourne les détails d'un projet en fonction de son ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du projet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du projet récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
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
router.get('/:id', ProjetController.getProjetById);

/**
 * @swagger
 * /api/projects/user/{userId}:
 *   get:
 *     summary: Récupère les projets d'un utilisateur spécifique
 *     description: Retourne la liste des projets associés à un utilisateur spécifique
 *     tags: [Projects]
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
router.get('/user/:userId', ProjetController.getProjetsByUser);

/**
 * @swagger
 * /api/projects/projet/{projetId}:
 *   post:
 *     summary: Met à jour un projet spécifique
 *     description: Met à jour les détails d'un projet spécifique
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         description: ID du projet
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
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
router.post('/projet/:projetId', ProjetController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Met à jour complètement un projet
 *     description: Met à jour complètement les détails d'un projet spécifique
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du projet
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
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
router.put('/:id', ProjetController.updateProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crée un nouveau projet
 *     description: Crée un nouveau projet avec les informations fournies
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Requête invalide
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
router.post('/', ProjetController.createProject);

export default router;
