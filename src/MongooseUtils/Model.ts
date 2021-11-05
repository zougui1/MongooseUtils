import mongoose from 'mongoose';
import _ from 'lodash';
import { Models } from './Model.types';
import { Debugs } from './Debugs';
//import * as utils from '../utils';

export class Model {

  models: Models = {};

  /**
   * create a schema mongoose
   * @param {mongoose.SchemaDefinition | undefined} schema
   * @param {mongoose.SchemaOptions | undefined} options
   * @returns {mongoose.Schema<any>}
   * @private
   */
  private createSchema(
    schema?: mongoose.SchemaDefinition | undefined,
    options?: mongoose.SchemaOptions | undefined
  ): mongoose.Schema<any> {
    return new mongoose.Schema(schema, options);
  }

  /**
   * create a model mongoose using a schema
   * @param {String} modelName
   * @param {mongoose.Schema<any>} schema
   * @param {string | undefined} collection
   * @param {boolean | undefined} skipInit
   * @returns {mongoose.Model<mongoose.Document, {}>}
   * @private
   */
  private createModelFromSchema(
    modelName: string,
    schema?: mongoose.Schema<any>,
    collection?: string | undefined,
    skipInit?: boolean | undefined
  ): mongoose.Model<mongoose.Document, {}> {
    const model = mongoose.model(modelName, schema, collection, skipInit);

    return this.models[modelName] = model;
  }

  /**
   * create a model mongoose
   * @param {String} modelName
   * @param {mongoose.SchemaDefinition | undefined} schema
   * @param {mongoose.SchemaOptions | undefined} schemaOptions
   * @param {string | undefined} collection
   * @param {boolean | undefined} skipInit
   * @returns {mongoose.Model<mongoose.Document, {}>}
   * @public
   */
  createModel(
    modelName: string,
    schema?: mongoose.SchemaDefinition | undefined,
    schemaOptions?: mongoose.SchemaOptions | undefined,
    collection?: string | undefined,
    skipInit?: boolean | undefined
  ): mongoose.Model<mongoose.Document, {}> {
    modelName = _.capitalize(modelName);

    return this.createModelFromSchema(
      modelName,
      this.createSchema(schema, schemaOptions),
      collection,
      skipInit
    );
  }

  /**
   * get a model by its name
   * @param {String} modelName
   * @returns {mongoose.Model<mongoose.Document, {}>}
   * @public
   */
  getModel(modelName: string): mongoose.Model<mongoose.Document, {}> {
    return this.models[_.capitalize(modelName)];
  }

};
