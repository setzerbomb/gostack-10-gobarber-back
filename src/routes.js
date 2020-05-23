import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import UserSchemaValidation from './app/middlewares/validation/UserSchema';
import AppointmentSchemaValidation from './app/middlewares/validation/AppointmentSchema';
import ScheduleSchemaValidation from './app/middlewares/validation/ScheduleSchema';

import isProvider from './app/middlewares/auth/isProvider';

import authMiddleware from './app/middlewares/auth/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserSchemaValidation.store, UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserSchemaValidation.update, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/providers', ProviderController.index);

routes.post(
  '/appointments',
  AppointmentSchemaValidation.store,
  AppointmentController.store
);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get(
  '/schedule',
  isProvider,
  ScheduleSchemaValidation.index,
  ScheduleController.index
);

routes.get('/notifications', isProvider, NotificationController.index);
routes.put('/notifications/:id', isProvider, NotificationController.update);

export default routes;
