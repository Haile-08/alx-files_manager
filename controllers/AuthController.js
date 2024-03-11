import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  /**
   * sign-in a user
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async getConnect(req, res) {
    const Authorization = req.header('Authorization') || '';
    
    const credentials = Authorization.split(' ')[1];

    if (!credentials) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );

    const email = decodedCredentials.split(':')[0] || '';

    if (!email) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const user = await dbClient.usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    } 

    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  /**
   * sign-out a user
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async getDisconnect(req, res) {
    const xToken = req.header('X-Token');

    await redisClient.del(`auth_${xToken}`);

    return res.status(204).json()
  }
}

export default AuthController;
