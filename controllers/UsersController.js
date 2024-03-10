import sha1 from 'sha1';
import dbClient from '../utils/db';

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
      return res.status(400).json('Missing email');
    }

    // check if there is a password value
    if (!password) {
      return res.status(400).json('Missing password');
    }

    // find if email already exists
    const emailExists = await dbClient.usersCollection.findOne({ email });

    // check if email already exists
    if (emailExists) {
      return res.status(400).json('Already exist');
    }

    // hash the password
    const hashedPassword = sha1(password);

    // create the user
    const user = await dbClient.usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    // response
    return res.status(201).json({
      id: user.insertedId.toString(),
      email,
    });
  }
}

export default UsersController;
