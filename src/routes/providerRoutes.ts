// routes/providerRoutes.ts
import express from 'express';
import ProviderController from '../controllers/ProviderController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du fournisseur
 *         name:
 *           type: string
 *           description: Nom du fournisseur
 *         description:
 *           type: string
 *           description: Description des services ou produits fournis
 *         contact:
 *           type: string
 *           description: Informations de contact du fournisseur
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur associé au fournisseur
 *     Organization:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de l'organisation
 *         name:
 *           type: string
 *           description: Nom de l'organisation
 *         description:
 *           type: string
 *           description: Description de l'organisation
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
 * /api/providers:
 *   get:
 *     summary: Récupère tous les fournisseurs
 *     description: Retourne la liste de tous les fournisseurs disponibles
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des fournisseurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
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
router.get('/providers', ProviderController.getAllProviders);

/**
 * @swagger
 * /api/providers/{id}:
 *   get:
 *     summary: Récupère les détails d'un fournisseur spécifique
 *     description: Retourne les détails d'un fournisseur en fonction de son ID
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du fournisseur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du fournisseur récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       401:
 *         description: Non autorisé - Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Fournisseur non trouvé
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
router.get('/providers/:id', ProviderController.getProviderDetails);

/**
 * @swagger
 * /api/providers/{userId}/organizations:
 *   get:
 *     summary: Récupère les fournisseurs associés à un utilisateur
 *     description: Retourne les fournisseurs associés à un utilisateur spécifique
 *     tags: [Providers]
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
 *         description: Fournisseurs récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
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
router.get('/providers/:userId/organizations', ProviderController.getProvidersByUser);

export default router;
