import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  /**
   * Number of users and files
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async postNew(req, res) {
    // receive a user and password
    const { email, password } = req.body;

    // check if there is an email value
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // check if there is a password value
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // find if email already exists
    const emailExists = await dbClient.usersCollection.findOne({ email });

    // check if email already exists
    if (emailExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // hash the password
    const hashedPassword = sha1(password);

    // create the user
    let user;
    try {
      user = await dbClient.usersCollection.insertOne({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      return res.status(500).send({ error: 'Error creating user.' });
    }

    // response
    return res.status(201).json({
      id: user.insertedId.toString(),
      email,
    });
  }

  static async getMe(req, res) {
    // extract the token
    const xToken = req.header('X-Token');

    // get the user id from catch
    const userId = await redisClient.get(`auth_${xToken}`);

    // Get the user from mongodb using id
    const user = await dbClient.usersCollection.findOne({ _id: new ObjectId(userId) });

    // check if user exists
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
    });
  }
}

export default UsersController;
