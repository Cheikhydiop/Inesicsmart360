// routes/requestRoutes.ts
import express from 'express';
import { RequestController } from '../controllers/RequestController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 *           description: ID de l'utilisateur ayant fait la demande
 *         organizationId:
 *           type: string
 *           description: ID de l'organisation associée à la demande
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la demande
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
 * /api/requests:
 *   get:
 *     summary: Récupère toutes les demandes
 *     description: Retourne la liste de toutes les demandes disponibles
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes récupérée avec succès
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
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', RequestController.getAllRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Récupère les détails d'une demande spécifique
 *     description: Retourne les détails d'une demande en fonction de son ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la demande
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la demande récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       401:
 *         description: Non autorisé - Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Demande non trouvée
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
router.get('/:id', RequestController.getRequestById);

/**
 * @swagger
 * /api/requests/organization/{id}:
 *   get:
 *     summary: Récupère les demandes pour une organisation spécifique
 *     description: Retourne les demandes associées à une organisation spécifique
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'organisation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Demandes récupérées avec succès
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
router.get('/organization/:id', RequestController.getRequestsByUserOrganization);

export default router;
