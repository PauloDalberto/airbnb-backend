import { Router } from 'express';
import SessionControler from './controllers/SessionControler';
import HouseController from './controllers/HouseController';
import DashboardController from './controllers/DashboarsController';
import ReserveController from './controllers/ReserveController';

import multer from 'multer';
import uploadConfig from './config/upload';

const routes = new Router();
const upload = multer(uploadConfig);

routes.post('/register', SessionControler.store);
routes.post('/login', SessionControler.login);

routes.post('/houses', upload.single('thumbnail'), HouseController.store);
routes.get('/houses', HouseController.index);
routes.put('/houses/:house_id',  upload.single('thumbnail'), HouseController.uptade);
routes.delete('/houses/:house_id', HouseController.delete);

routes.get('/dashboard', DashboardController.show);

routes.post('/houses/:house_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel/:reserve_id', ReserveController.delete)

export default routes;