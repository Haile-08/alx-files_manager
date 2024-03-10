import express from 'express';

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

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
}

export default apiRouter;
