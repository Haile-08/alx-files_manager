#!/usr/bin/node
import { createClient } from 'redis';
import { promisify } from 'util';
/**
 * Represent a redis client
 */

class RedisClient {
  /**
   * Create a redis instance
   */
  constructor() {
    this.isClientConnected = true;
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * check if the client is connected to redis
   * @return {boolean} true if connected false if not
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Get the value of a key
   * @param {String} key the key of value
   * @return {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * store a value with expiration time
   * @param {String} key the key value to store
   * @param {number} value the value to store
   * @param {number} duation the time to expire in second
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
