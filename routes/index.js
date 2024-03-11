import express from 'express';

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

/**
 * Inject the router to the server.js
 * @param {app}
 */
function apiRouter(app) {
  const router = express.Router();

  app.use('/', router);

  // Check if redis is alive
  router.get('/status', AppController.getStatus);

  // get number of users
  router.get('/stats', AppController.getStats);

  // post a new user
  router.post('/users', UsersController.postNew);

  // sign-in a user
  router.get('/connect', AuthController.getConnect);

  // sign-out a user
  router.get('/disconnect', AuthController.getDisconnect);

  // Retrieve the user
  router.get('/users/me', UsersController.getMe)
}

export default apiRouter;
