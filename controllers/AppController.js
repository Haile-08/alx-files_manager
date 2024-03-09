import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Check if redis is connected
   * @params {Object} req request object
   * @params {Object} res response object
   */

  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).json(status);
  }

  /**
   * Number of users and files
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).json(stats);
  }
}

export default AppController;
