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
    // extract authorization token
    const Authorization = req.header('Authorization') || '';
    // spilt the basic text from the auth
    const credentials = Authorization.split(' ')[1];

    // check if the token exists
    if (!credentials) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // decode the credentials to get the email
    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );

    // split the email from the password
    const [email, password] = decodedCredentials.split(':');

    // check if email exists and password
    if (!email || !password) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const sha1Password = sha1(password);

    // find the user from the mongodb
    const user = await dbClient.usersCollection.findOne({
      email,
      password: sha1Password,
    });

    // check if user exists
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // generate a token
    const token = uuidv4();

    // catch the token for 24 hours
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    return res.status(200).json({ token });
  }

  /**
   * sign-out a user
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async getDisconnect(req, res) {
    // extract the token
    const xToken = req.header('X-Token');

    // remove the token from catch
    await redisClient.del(`auth_${xToken}`);

    return res.status(204).json();
  }
}

export default AuthController;
