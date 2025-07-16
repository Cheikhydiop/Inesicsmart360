// routes/inventoryRoutes.ts
import express from 'express';
import InventaireController from '../controllers/InventaireController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de l'article
 *         name:
 *           type: string
 *           description: Nom de l'article
 *         description:
 *           type: string
 *           description: Description de l'article
 *         quantity:
 *           type: integer
 *           description: Quantité en stock
 *         organizationId:
 *           type: string
 *           description: ID de l'organisation
 *     InventoryStats:
 *       type: object
 *       properties:
 *         totalItems:
 *           type: integer
 *           description: Nombre total d'articles
 *         lowStockItems:
 *           type: integer
 *           description: Nombre d'articles en faible quantité
 *     InventoryTransaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de la transaction
 *         itemId:
 *           type: string
 *           description: ID de l'article
 *         quantity:
 *           type: integer
 *           description: Quantité de l'article dans la transaction
 *         type:
 *           type: string
 *           enum: [in, out]
 *           description: Type de transaction (entrée ou sortie)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date de la transaction
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
 * /api/inventory/organization/{organizationId}/inventory:
 *   get:
 *     summary: Récupère l'inventaire d'une organisation
 *     description: Retourne la liste des articles d'inventaire pour l'organisation spécifiée
 *     tags: [Inventory]
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
 *         description: Inventaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
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
router.get('/organization/:organizationId/inventory', InventaireController.getInventoryByOrganization);

/**
 * @swagger
 * /api/inventory/organization/{organizationId}/inventory/stats:
 *   get:
 *     summary: Récupère les statistiques d'inventaire d'une organisation
 *     description: Retourne les statistiques d'inventaire pour l'organisation spécifiée
 *     tags: [Inventory]
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
 *         description: Statistiques d'inventaire récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryStats'
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
router.get('/organization/:organizationId/inventory/stats', InventaireController.getInventoryStatsByOrganization);

/**
 * @swagger
 * /api/inventory/organization/{organizationId}/inventory/transactions:
 *   get:
 *     summary: Récupère les transactions d'inventaire d'une organisation
 *     description: Retourne la liste des transactions d'inventaire pour l'organisation spécifiée
 *     tags: [Inventory]
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
 *         description: Transactions d'inventaire récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryTransaction'
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
router.get('/organization/:organizationId/inventory/transactions', InventaireController.getInventoryTransactionsByOrganization);

/**
 * @swagger
 * /api/inventory/{itemId}/details:
 *   get:
 *     summary: Récupère les détails d'un article d'inventaire
 *     description: Retourne les détails d'un article d'inventaire spécifique
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID de l'article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'article récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Non autorisé - Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article non trouvé
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
router.get('/:itemId/details', InventaireController.getItemDetails);

/**
 * @swagger
 * /api/inventory/{equipmentId}/details/equipement:
 *   get:
 *     summary: Récupère les détails d'un équipement
 *     description: Retourne les détails d'un équipement spécifique
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipmentId
 *         required: true
 *         description: ID de l'équipement
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'équipement récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Non autorisé - Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Équipement non trouvé
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
router.get('/:equipmentId/details/equipement', InventaireController.getEquipmentWithDetails);

export default router;
