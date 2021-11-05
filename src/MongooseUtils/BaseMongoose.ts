import _ from 'lodash';
import mongoose from 'mongoose';
import * as utils from '../utils';
import { IBaseMongoose } from './BaseMongoose.types';
import { Options } from './index.types';
import { Debugs } from './Debugs';

export class BaseMongoose implements IBaseMongoose {

  options: Options = new Options();

  excludedProps = [
    ...Object.keys(mongoose.Schema.reserved), // keywords reserved by mongoose
    'type', 'required', 'default', 'select', 'validate', 'get', 'set', 'alias', 'index', 'unique',
    'sparse', 'lowercase','uppercase', 'trim', 'match', 'enum', 'minlength', 'maxlength', 'min', 'max'
  ];

  //TODO: pass the output paths into the options (errorPath, systemPath)
  //TODO: set  errorLogger as true by default
  constructor() {
    this.configurator();
  }

  /**
   * configure mongoose
   */
  configurator() {
    mongoose.Promise = this.options.Promise;

    const { mongooseOptions } = this.options;

    for (const key in mongooseOptions) {
      if (mongooseOptions.hasOwnProperty(key)) {
        mongoose.set(key, mongooseOptions[key]);
      }
    }
  }

  /**
   * Opens the default mongoose connection. Options passed take precedence over options included in connection strings.
   * @param {String} mongoURI
   * @returns {Promise<typeof mongoose>} pseudo promise wrapper around this
   * @public
   */
  connect (mongoURI: string): Promise<typeof mongoose> {
    if (_.isString(mongoURI)) {
      return this.connectString(mongoURI);
    }
    else {
      throw new Error(`MongooseUtils, first param of "connect" must be of type "string" or "object", instead received "${typeof mongoURI}"`);
    }
  }

  /**
   * Opens the default mongoose connection. Options passed take precedence over options included in connection strings.
   * @param {String} mongoURI
   * @returns {Promise<typeof mongoose>} pseudo promise wrapper around this
   * @private
   */
  private connectString(mongoURI: string): Promise<typeof mongoose> {
    const mongooseConnection = mongoose.connect(mongoURI, this.options.connectOptions);

    mongooseConnection.then(() => {
        Debugs.success('MongoDB is ready to use.');
      })
      .catch(err => {
        Debugs.error('MongoDB error');
        throw err;
      });

    return mongooseConnection;
  }

};
