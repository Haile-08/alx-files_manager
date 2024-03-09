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
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";
    const dbUrl = `mongodb://${host}:${port}/${database}`;

    this.client = MongoClient(dbUrl, { useUnifiedTopology: true });
    this.client.connect();
    }

  /**
   * check if the client is connected to mongodb
   * @return {boolean} true if connected false if not
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Number of documents in the collection users
   * @return {number} number of documents
   */
  async nbUsers() {
    return this.client.db().collection("users").countDocuments();
  }

  /**
   * Number of documents in the collection files
   * @return {number} number of documents
   */
  async nbFiles() {
    return this.client.db().collection("files").countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
