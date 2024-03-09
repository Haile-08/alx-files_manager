#!/usr/bin/node
import { createClient } from 'redis';
import { promisify } from 'util';
/**
 * Represnet a redis client
 */


class RedisClient {
  /**
   * Create a redis instance
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
    });
    this.client.on('connect', () => {
      // console.log('Redis client connected to the server');
    });
  }
  
  /**
   * check if the client is connected to redis
   * @return {boolean} truen if connected false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key
   * @param {String} key the key of value
   * @return {String | Object}
   */
  async get(key) {
    return this.client.get(key)
  }

  /**
   * store a value with expriation time
   * @param {String} key the key value to store
   * @param {number} value the value to store
   * @param {number} duation the time to exprie in second
   */
  async set(key, value, duration) {
    await this.client.SETEX(key, duration, value);
  }

  /**
   * remove a value from redis
   * @param {String} key of the value
   */
  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
