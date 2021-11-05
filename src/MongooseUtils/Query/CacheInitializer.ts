import mongoose from 'mongoose';
import redis from 'redis';
import { promisify } from 'util';
import * as utils from '../../utils';
import { Debugs } from '../Debugs';

export class CacheInitializer {

  client: any;

  redisInit (options: any = {}) {
    try {
      const protocol = 'redis://';
      const url = options.url || 'localhost';
      const port = ':' + (options.port || 6379);
      this.client = redis.createClient(protocol + url + port);
      this.client.hget = promisify(this.client.hget);
      this.client.get = promisify(this.client.get);
      this.modifyMongoosePrototypes();
    } catch (error) {
      Debugs.error('redis: an error occured', error);
      Debugs.info('make sure redis-server is in use => D:\\programs\\Redis\\redis-server.exe');
    }
  }

  modifyMongoosePrototypes () {
    const exec = mongoose.Query.prototype.exec;
    // use the context of 'this' inside of the function that would redefine 'this'
    const that = this;

    // @ts-ignore
    mongoose.Query.prototype.cache = function (options: any = {}) {
      const self: any = this;
      self.useCache = true;
      self.hashKey = JSON.stringify(options.key || '');
      //this.hashSubKey = JSON.stringify(options.subKey || '');
      return this;
    }

    // @ts-ignore
    mongoose.Query.prototype.noCache = function () {
      const self: any = this;
      self.noCache = true;
      self.useCache = false;
      return this;
    }

    mongoose.Query.prototype.exec = async function (...parameters: any) {
      const self: any = this;
      if(!self.useCache || self.noCache) return exec.apply(this, parameters);

      const key = JSON.stringify(
        Object.assign({}, self.options, {
          collection: self.mongooseCollection.name,
        })
      );

      const cacheValue = await that.client.hget(self.hashKey, key);

      if(cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc)
          ? doc.map(d => new self.model(d))
          : new self.model(doc);
      }

      const result = await exec.apply(this, parameters);
      that.client.hset(self.hashKey, key, JSON.stringify(result));

      return result;
    }
  }

  clearHash (hashKey: any, hashSubKey: any) {
    if (hashSubKey) this.client.del(JSON.stringify(hashKey), JSON.stringify(hashSubKey));
		else this.client.del(JSON.stringify(hashKey));
	}

};
