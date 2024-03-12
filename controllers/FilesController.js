import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import dbClient from "../utils/db";
import redisClient from '../utils/redis';

class FilesController {
  /**
   * Create a new file in DB and in disk
   * @params {Object} req request object
   * @params {Object} res response object
   */
  static async postUpload(req, res) {
    // extract the token
    const xToken = req.header('X-Token');
    const allowedTypes = ['folder', 'file', 'image']
    const {name, type, data, parentId = 0, isPublic = false} = req.body;


    // get the user id from catch
    const userId = await redisClient.get(`auth_${xToken}`);

    // Get the user from mongodb using id
    const user = await dbClient.usersCollection.findOne({ _id: new ObjectId(userId) });

    // check if user exists
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).send({ error: 'Missing name' });
    }

    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).send({ error: 'Missing type' });
    }

    if (!data && type != 'folder') {
      return res.status(400).send({ error: 'Missing data' });
    }

    if (parentId && parentId !== '0') {
      const file = await dbClient.usersCollection.findOne({
        _id: ObjectId(parentId),
      });

      if(!file) {
        return res.status(400).send({ error: 'Parent not found' });
      }

      if(file.type !== 'folder') {
        return res.status(400).send({ error: 'Parent is not a folder' });
      }
    }

    const query = {
        userId: ObjectId(userId),
        name,
        type,
        isPublic,
        parentId,
    };
    if (type !== 'folder'){
      const fileNameUUID = uuidv4();
      const fileDataDecoded = Buffer.from(data, 'base64');

      let path

      if (!process.env.FOLDER_PATH || process.env.FOLDER_PATH.trim() !== '') {
        path = `/tmp/files_manager/${fileNameUUID}`;
        await fsPromises.mkdir('/tmp/files_manager/', { recursive: true });
        await fsPromises.writeFile(path, fileDataDecoded);
      }else {
        path = `${process.env.FOLDER_PATH}/${fileNameUUID}`;
        await fsPromises.mkdir(`${process.env.FOLDER_PATH}`, { recursive: true });
        await fsPromises.writeFile(path, fileDataDecoded);
      }

      query.localPath = path;

    }
    const file = await dbClient.filesCollection.insertOne(query);
    const result = {
        id: file.ops[0]._id,
        userId: file.ops[0].userId,
        name: file.ops[0].name,
        type: file.ops[0].type,
        isPublic: file.ops[0].isPublic,
        parentId: file.ops[0].parentId,
    }
    return res.status(201).json(result);
  }
}

export default FilesController;