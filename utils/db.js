#!/usr/bin/node
const { MongoClient } = require('mongodb');
/**
 * Represent a mongodb client
 */

class DBClient {
  /**
   * Create a mongodb instance
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbUrl = `mongodb://${host}:${port}`;

    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        // console.log('Connected successfully to server');
        this.db = client.db(database);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  /**
   * check if the client is connected to mongodb
   * @return {boolean} true if connected false if not
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Number of documents in the collection users
   * @return {number} number of documents
   */
  async nbUsers() {
    const numberOfUsers = this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  /**
   * Number of documents in the collection files
   * @return {number} number of documents
   */
  async nbFiles() {
    const numberOfFiles = this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
