import { Express } from 'express';
import userRoutes from './userRoute';
import requestRoutes from './requestRoutes'; 
import providerRoutes from './providerRoutes'; 
import inventaireRoutes from './inventaireRoutes';
import projetRoutes from './projetRoutes';
import dashboardRoutes from './dashboardRoutes';


export default function (app: Express) {
  app.use('/api/users', userRoutes);
  app.use('/api/requests', requestRoutes); 
  app.use('/api', providerRoutes); 
  app.use('/api/users', userRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/inventaire', inventaireRoutes); 
  app.use('/api/equipements', inventaireRoutes);
  app.use('/api/projets', projetRoutes); 
  app.use('/api/dashboard', dashboardRoutes); 



}


