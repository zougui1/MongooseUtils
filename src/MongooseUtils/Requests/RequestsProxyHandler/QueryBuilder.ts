import mongoose from 'mongoose';
import chalk from 'chalk';
import _ from 'lodash';
import { IndexableDocument } from '../../Query/Requests.types';
import { Models } from '../../Model.types';
import { RequestsObject } from '../index.types';
import { Debugs } from '../../Debugs';
import { Crud } from '../../Query/CRUD';
import { Options } from '../../index.types';
import { Query } from '../../Query';

export class Data {
  // property from `Model`
  models: Models;

  // property from `MongooseUtils`
  options: Options;

  methods = ['find', 'delete', 'remove', 'update', 'replace'];
  methodExtensions = ['One', 'Many'];
  methodAddons = ['ById', 'AndDelete', 'AndRemove', 'AndUpdate', 'AndReplace'];
  notLimitable = ['delete', 'remove', 'update', 'replace'];
  defineCustomQuery = ['By'];
  requests: RequestsObject;

  query: IQuery = {
    methodName: '',
    modelName: '',
    methodExtension: '',
    methodAddon: '',

    customQuery: {
      entries: {}
    },

    specialArgs: {
      limit: 0,
      skip: 0,
    },

    args: [],
  };

  target: any;
  originialName: string = '';
  name: string = '';

  /**
   * get the current model based on the `modelName` in the `query` object
   * @returns {mongoose.Model<mongoose.Document, {}>}
   * @public
   */
  get model() {
    return this.models[this.query.modelName];
  }

  /**
   * get the full method name based on the data in the `query` object
   * @returns {String}
   * @public
   */
  get method() {
    const { methodName, methodExtension, methodAddon } = this.query;
    return methodName + (methodExtension || '') + (methodAddon || '');
  }

  /**
   * return whether or not the query is custom
   * @returns {String}
   * @public
   */
  get isCustomQuery(): boolean {
    return Object.keys(this.query.customQuery.entries).length > 0;
  }

  constructor(requests: RequestsObject, models: Models, options: Options) {
    this.requests = requests;
    this.models = models;
    this.options = options;
  }
}

export class QueryBuilder {

  private static data: Data;

  /**
   * @param {RequestsObject} requests
   * @param {Models} models
   * @public
   */
  constructor(requests: RequestsObject, models: Models, options: Options) {
    QueryBuilder.data = new Data(requests, models, options);
  }

  /**
   * build a query automatically and return it
   * @param {any} target
   * @param {String} name
   * @returns {Function}
   * @public
   */
  buildQuery(target: any, name: string): Function {
    QueryBuilder.data.target = target;
    QueryBuilder.data.originialName = name;
    QueryBuilder.data.name = name;

    QueryBuilder.setMethodName();
    QueryBuilder.setMethodExtension();
    QueryBuilder.setSpecialData();
    QueryBuilder.setModelName();
    QueryBuilder.setCustomAddon();
    QueryBuilder.setMethodAddon();

    return QueryBuilder.mongoQuery;
  }

  /**
   * shrink the name length by the length of the value passed in parameter
   * @param {String} value
   * @private
   * @static
   */
  private static shrinkName(value: number): void {
    QueryBuilder.data.name = QueryBuilder.data.name.substring(value);
  }

  /**
   *
   * @param {String} str string in which we want to find the starting of it
   * @param {String[]} arr array in which we search the the beginning of the string
   * @returns {String | undefined}
   * @private
   * @static
   */
  private static findStartOfString(str: string, arr: string[]) {
    return arr.find(s => str.startsWith(s));
  }

  /**
   *
   * @param {String[]} arr array in which we search the the beginning of the name
   * @returns {String | undefined}
   * @private
   * @static
   */
  private static findStartOfName(arr: string[]) {
    const { name } = QueryBuilder.data;
    return QueryBuilder.findStartOfString(name, arr);
  }

  /**
   *
   * @param {String[]} array
   * @param {String | Error} errorIfNull
   * @returns {String | Function | undefined}
   * @private
   * @static
   */
  private static findMethodPart(array: string[]): string | undefined {
    const methodPart = QueryBuilder.findStartOfName(array);

    if (methodPart) {
      QueryBuilder.shrinkName(methodPart.length);

      return methodPart;
    }
  }

  /**
   * find the method name
   * @private
   * @static
   */
  private static setMethodName() {
    const methodName = QueryBuilder.findMethodPart(QueryBuilder.data.methods);

    if (!methodName) {
      throw new Error('no method');
    }

    QueryBuilder.data.query.methodName = methodName;
  }

  /**
   * find the method extension
   * @private
   * @static
   */
  private static setMethodExtension() {
    const methodExtension = QueryBuilder.findMethodPart(QueryBuilder.data.methodExtensions);
    QueryBuilder.data.query.methodExtension = methodExtension;
  }

  /**
   * find the model name
   * @private
   * @static
   */
  private static setModelName() {
    const modelName = QueryBuilder.findMethodPart(Object.keys(QueryBuilder.data.models));

    if (!modelName) {
      throw new Error('no model');
    }

    QueryBuilder.data.query.modelName = modelName;
  }

  /**
   * set special data
   * @private
   * @static
   */
  private static setSpecialData() {
    const { name, options } = QueryBuilder.data;
    const { maxLimit } = options.queries;

    const match = Number(name.match(/^[0-9]+/));

    if (match > maxLimit) {
      throw new Error(
        `The number of documents is limited to "${maxLimit}", got "${match}"\n` +
        `See <doc_link> to change the limit`
      );
    }

    if (match) {
      QueryBuilder.shrinkName(match.toString().length);

      // if the value is '1' we want to perform a query for a single document
      // otherwise we set the quantity to perform a query for multiple documents
      if (match === 1) {
        QueryBuilder.data.query.methodExtension = 'One';
      } else {
        QueryBuilder.data.query.specialArgs.limit = match;
      }
    }
  }

  /**
   * set the method addon in the query data
   * @private
   * @static
   */
  private static setMethodAddon() {
    const addon1 = QueryBuilder.findMethodPart(QueryBuilder.data.methodAddons) || '';
    const addon2 = QueryBuilder.findMethodPart(QueryBuilder.data.methodAddons) || '';

    QueryBuilder.data.query.methodAddon = addon1 + addon2;
  }

  /**
   * @param {Array} args: arguments to provide to the functions
   * @returns {Promise<IndexableDocument[]>}
   * @private
   * @static
  */
  private static async quantifiedSpecialRequests(args: any[] = []): Promise<IndexableDocument[]> {
    const { modelName, specialArgs } = QueryBuilder.data.query;
    // QueryBuilder.models = an object containing all the models (basically, a model is what define what can contains, how is structured, each document of the collection)
    // find request, with a limitation
    const documents = await QueryBuilder.data.models[modelName].find(...args).limit(specialArgs.limit);
      // all founds documents
    return QueryBuilder.requestOnManyDocs(documents, args);
  }

  /**
   * make a request on multiple documents
   * @param {IndexableDocument[]} documents
   * @param {any[]} args
   * @returns {Promise<IndexableDocument[]>}
   * @private
   * @static
   */
  private static async requestOnManyDocs(
    documents: IndexableDocument[],
    args: any[]
  ): Promise<IndexableDocument[]> {
    let { methodName } = QueryBuilder.data.query;
    let documentsAfterRequest: IndexableDocument[] = [];
    const documentsNumber = documents.length;
    //args.shift();

    // "update" unlike "updateOne" is deprecated
    // "replace" unlike "replaceOne" doesn't exists
    if (methodName === 'update' || methodName === 'replace') {
      methodName += 'One';
    }

    for (let i = 0; i < documentsNumber; i++) {
      const document = documents[i];
      // do the request on the documents individually
      const doc: IndexableDocument = await document[methodName](...args);

      documentsAfterRequest.push(doc);
    }

    return documentsAfterRequest;
  }

  /**
   * set a custom addon if any
   * @private
   * @static
   */
  private static setCustomAddon() {
    const { model, methodAddons, query } = QueryBuilder.data;
    const modelProperties = Object.keys(model.schema.obj);

    const hasCondition = QueryBuilder.findStartOfName(['By']);
    const isCustom = !QueryBuilder.findStartOfName(methodAddons);
    let customAddon;

    if (hasCondition && isCustom) {
      QueryBuilder.shrinkName(hasCondition.length);
      const dirtyCustomAddon = QueryBuilder.findMethodPart(modelProperties.map(str => _.capitalize(str)));

      const regex = new RegExp(`^${dirtyCustomAddon}`, 'i');
      customAddon = modelProperties.find(str => regex.test(str));

      if (customAddon) {
        QueryBuilder.data.query.customQuery.entries[customAddon] = undefined;
      } else {
        throw new Error(
          `"${query.modelName}" model doesn't have a "${QueryBuilder.data.name}" property`
        );
      }
    }
  }

  /**
   * perform a custom request
   * @param {Array} args arguments to pass to the query
   * @private
   * @static
   */
  private static editArgsForCustomRequest() {
    const { customQuery, args } = QueryBuilder.data.query;


    QueryBuilder.data.query.args = [
      {
        [Object.keys(customQuery.entries)[0]]: args[0]
      },
      ...args.slice(1, args.length)
    ];

  }

  /**
   * generate the query
   * @param {Array} args arguments to pass to the query
   * @returns {Query | Promise<IndexableDocument[]>}
   * @private
   * @static
   */
  private static mongoQuery(..._args: any[]): Query | Promise<IndexableDocument[]> {
    QueryBuilder.data.query.args = _args;
    const { methodName, args, specialArgs } = QueryBuilder.data.query;

    // QueryBuilder.notLimitable = requests that can't be directly limited (remove, delete, update, replace)
    if(_.includes(QueryBuilder.data.notLimitable, methodName) && specialArgs.limit) {
      return QueryBuilder.quantifiedSpecialRequests(args);
    }

    if (QueryBuilder.data.isCustomQuery) {
      QueryBuilder.editArgsForCustomRequest();
    }

    QueryBuilder.data.query.args[0] = QueryBuilder.data.query.args[0] || {};
    QueryBuilder.data.query.args[1] = QueryBuilder.data.query.args[1] || {};
    return QueryBuilder.baseQuery();
  }

  /**
   * generate the base query based on the model and the method generated
   * @returns {Query}
   * @private
   * @static
   */
  private static baseQuery(): Query {
    return new Query(QueryBuilder.data);
  }

}
