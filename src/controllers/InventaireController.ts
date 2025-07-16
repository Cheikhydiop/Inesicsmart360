import { Request, Response } from 'express';
import InventaireService from '../services/InventaireService';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { asyncHandler } from '../middlewares/asyncHandler';

export default class InventaireController {
  // static async getInventoryItems(req: Request, res: Response) {
  //   try {
  //     const { where, orderBy } = req.query;
  //     const parsedWhere = where ? JSON.parse(where as string) : undefined;
  //     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
  //     const result = await InventaireService.getInventoryItems({
  //       findOptions: {
  //         where: parsedWhere,
  //         orderBy: parsedOrderBy,
  //       },
  //     });
      
  //     res.status(200).json(result);
  //   } catch (error: any) {
  //     console.error('❌ Error in getInventoryItems:', error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async getInventoryTransactions(req: Request, res: Response) {
  //   try {
  //     const { where, orderBy } = req.query;
  //     const parsedWhere = where ? JSON.parse(where as string) : undefined;
  //     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
  //     const result = await InventaireService.getInventoryTransactions({
  //       findOptions: {
  //         where: parsedWhere,
  //         orderBy: parsedOrderBy,
  //       },
  //     });
      
  //     res.status(200).json(result);
  //   } catch (error: any) {
  //     console.error('❌ Error in getInventoryTransactions:', error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async getMaintenanceRecords(req: Request, res: Response) {
  //   try {
  //     const { where, orderBy } = req.query;
  //     const parsedWhere = where ? JSON.parse(where as string) : undefined;
  //     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
  //     const result = await InventaireService.getMaintenanceRecords({
  //       findOptions: {
  //         where: parsedWhere,
  //         orderBy: parsedOrderBy,
  //       },
  //     });
      
  //     res.status(200).json(result);
  //   } catch (error: any) {
  //     console.error('❌ Error in getMaintenanceRecords:', error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async getLocations(req: Request, res: Response) {
  //   try {
  //     const { where, orderBy } = req.query;
  //     const parsedWhere = where ? JSON.parse(where as string) : undefined;
  //     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
  //     const result = await InventaireService.getLocations({
  //       findOptions: {
  //         where: parsedWhere,
  //         orderBy: parsedOrderBy,
  //       },
  //     });
      
  //     res.status(200).json(result);
  //   } catch (error: any) {
  //     console.error('❌ Error in getLocations:', error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async getEquipements(req: Request, res: Response) {
  //   try {
  //     const { where, orderBy } = req.query;
  //     const parsedWhere = where ? JSON.parse(where as string) : undefined;
  //     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
  //     const result = await InventaireService.getEquipements({
  //       findOptions: {
  //         where: parsedWhere,
  //         orderBy: parsedOrderBy,
  //       },
  //     });
      
  //     res.status(200).json(result);
  //   } catch (error: any) {
  //     console.error('❌ Error in getEquipements:', error); // Corrigé : était "getLocations"
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // Nouvelles méthodes pour les inventaires par organisation

  static getInventoryByOrganization  = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const { where, orderBy } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ 
          error: 'L\'ID de l\'organisation est requis' 
        });
      }

      const parsedWhere = where ? JSON.parse(where as string) : undefined;
      const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
      const result = await InventaireService.getInventoryByOrganization(organizationId, {
        findOptions: {
          where: parsedWhere,
          orderBy: parsedOrderBy,
        },
      });
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Error in getInventoryByOrganization:', error);
      res.status(500).json({ error: error.message });
    }
  });

  static  getInventoryStatsByOrganization =   asyncHandler(async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      
      if (!organizationId) {
        return res.status(400).json({ 
          error: 'L\'ID de l\'organisation est requis' 
        });
      }
      
      const result = await InventaireService.getInventoryStatsByOrganization(organizationId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Error in getInventoryStatsByOrganization:', error);
      res.status(500).json({ error: error.message });
    }
  })
  static  getInventoryTransactionsByOrganization= asyncHandler(async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const { where, orderBy } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ 
          error: 'L\'ID de l\'organisation est requis' 
        });
      }

      const parsedWhere = where ? JSON.parse(where as string) : undefined;
      const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
      
      const result = await InventaireService.getInventoryTransactionsByOrganization(organizationId, {
        findOptions: {
          where: parsedWhere,
          orderBy: parsedOrderBy,
        },
      });
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Error in getInventoryTransactionsByOrganization:', error);
      res.status(500).json({ error: error.message });
    }
  });


    static  getItemDetails =asyncHandler(async (req: Request, res: Response) => {
      const itemId = req.params.itemId;
  
      try {
        const result = await InventaireService.getItemDetails(itemId);
  
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } catch (error) {
        console.error('❌ Erreur dans InventoryController.getItemDetails:', error);
  
        if (error instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }
  
        if (error instanceof DatabaseError) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }
  
        // Catch-all fallback
        return res.status(500).json({
          success: false,
          message: "Une erreur inattendue est survenue.",
        });
      }
    });


    static getEquipmentWithDetails =asyncHandler(async (req: Request, res: Response) => {
      const equipmentId = req.params.equipmentId;
    
      try {
        const equipment = await InventaireService.getEquipmentWithDetails(equipmentId);
    
        return res.status(200).json({
          success: true,
          message: 'Équipement récupéré avec succès',
          data: equipment,
        });
      } catch (error) {
        console.error('❌ Erreur dans InventoryController.getEquipmentWithDetails:', error);
    
        if (error instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }
    
        if (error instanceof DatabaseError) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }
    
        return res.status(500).json({
          success: false,
          message: "Une erreur inattendue est survenue.",
        });
      }
    })
    
  
  
}