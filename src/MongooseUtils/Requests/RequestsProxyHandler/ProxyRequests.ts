import mongoose from 'mongoose';
import _ from 'lodash';
import { IndexableDocument } from '../../Query/Requests.types';
import { Models } from '../../Model.types';
import { RequestsObject } from '../index.types';

export class ProxyRequests {

  // property from `Model`
  models: Models;

  methods = ['find', 'delete', 'remove', 'update', 'replace'];
  methodExtensions = ['One', 'Many'];
  methodAddons = ['ById', 'AndDelete', 'AndRemove', 'AndUpdate', 'AndReplace'];
  notLimitable = ['delete', 'remove', 'update', 'replace'];
  requests: RequestsObject;

  query: Query = {
    methodName: '',
    modelName: '',
    methodExtension: '',
    methodAddon: ''
  };

  target: any;
  name: string = '';

  specials: SpecialData = {
    methodExtensions: {
      quantity: {
        type: 'number',
        value: null
      }
    },
  };

  /**
   * @param {RequestsObject} requests
   * @public
   */
  constructor(requests: RequestsObject, models: Models) {
    this.requests = requests;
    this.models = models;
  }

  /**
   * @param {Object} target: the proxied object
   * @param {String} name: the prop's name we are trying to get
   * @return {Function} return a function since all we try to gets are functions
   *
   * TODO maybe not every time a function, but use some specifics name for specific stuff, like the 'matchesAny' method?
   * TODO to do so, just store the request in a variable, add it an objet (example: query), and return it
   * TODO then when a query method is called, verify if that object exists and is defined, then merge it in the query function with its own query object
   *
   * TODO store the query methods in a variable in the mongoose's query object, then call it with an "execute" method
   * TODO do it automatically if an argument is equal to 'true'
   */
  makeRequest(target: any, name: string): Function {
    if (_.isSymbol(name)) {
      throw new Error('Prop must not be a Symbol');
    }

    if (target[name]) return target[name];

    this.target = target;
    this.name = name;

    this.setMethodName();
    this.setMethodExtension();
    this.setSpecialData();
    this.setModelName();
    this.setMethodAddon();

    return (...args: any) => {
      const { methodName, methodExtension, modelName, methodAddon } = this.query;
      const fullMethod = methodName + (methodExtension || '') + (methodAddon || '');
      // this.notLimitable = requests that can't be directly limited (remove, delete, update, replace)
      if(_.includes(this.notLimitable, methodName) && this.specials.methodExtensions.quantity.value) {
        return this.quantifiedSpecialRequests(modelName, methodName as string, this.specials, args);
      }

      const models: any = this.models;
      return models[modelName][fullMethod](...args).limit(this.specials.methodExtensions.quantity.value);
    }
  }

  private shrinkName(value: string) {
    this.name = this.name.substring(value.length);
  }

  /**
   *
   * @param {String} str string in which we want to find the starting of it
   * @param {String[]} arr array in which we search the the beginning of the string
   * @returns {String | undefined}
   * @private
   */
  private findStartOfString(str: string, arr: string[]) {
    return arr.find(s => str.startsWith(s));
  }

  /**
   *
   * @param {String[]} array
   * @param {String | Error} errorIfNull
   * @returns {String | Function | undefined}
   * @private
   */
  private findMethodPart(array: string[]): string | undefined {
    let methodPart = this.findStartOfString(this.name, array);

    if (methodPart) {
      this.shrinkName(methodPart);

      return methodPart;
    }
  }

  /**
   * find the method name
   * @private
   */
  private setMethodName() {
    const methodName = this.findMethodPart(this.methods);

    if (!methodName) {
      throw new Error('no method');
    }

    this.query.methodName = methodName;
  }

  /**
   * find the method extension
   * @private
   */
  private setMethodExtension() {
    const methodExtension = this.findMethodPart(this.methodExtensions);
    this.query.methodExtension = methodExtension;
  }

  /**
   * find the model name
   * @private
   */
  private setModelName() {
    const modelName = this.findMethodPart(Object.keys(this.models));

    if (!modelName) {
      throw new Error('no model');
    }

    this.query.modelName = modelName;
  }

  /**
   * set special data
   * @private
   */
  private setSpecialData() {
    const match = Number(this.name.match(/^[0-9]+/));
    if (match) {
      this.shrinkName(match.toString());

      // if the value is '1' we want to perform a query for a single document
      // otherwise we set the quantity to perform a query for multiple documents
      if (match === 1) {
        this.query.methodExtension = 'One';
      } else {
        this.specials.methodExtensions.quantity.value = match;
      }
    }
  }

  private setMethodAddon() {
    const addon1 = this.findMethodPart(this.methodAddons) || '';
    const addon2 = this.findMethodPart(this.methodAddons) || '';

    this.query.methodAddon = addon1 + addon2;
  }

  /**
   * @param {String} modelName: the collection where the documents are from
   * @param {String} method: the request type to do
   * @param {Object} specials: some data for specials stuff
   * @param {Array} args: arguments to provide to the functions
   * @returns {Promise<IndexableDocument[]>}
   * @private
  */
  private async quantifiedSpecialRequests(
    modelName: string,
    method: string,
    specials: any,
    args: any[] = []
  ): Promise<IndexableDocument[]> {
    // this.models = an object containing all the models (basically, a model is what define what can contains, how is structured, each document of the collection)
    // find request, with a limitation
    const documents = await this.models[modelName].find(...args).limit(specials.methodExtensions.quantity.value);
      // all founds documents
    return this.requestOnManyDocs(documents, method, args);
  }

  /**
   * make a request on multiple documents
   * @param {IndexableDocument[]} documents
   * @param {String} request
   * @param {any[]} args
   * @returns {Promise<IndexableDocument[]>}
   * @private
   */
  private async requestOnManyDocs(
    documents: IndexableDocument[],
    request: string,
    args: any[]
  ): Promise<IndexableDocument[]> {
    let documentsAfterRequest: IndexableDocument[] = [];
    const documentsNumber = documents.length;
    //args.shift();

    // "update" unlike "updateOne" is deprecated
    // "replace" unlike "replaceOne" doesn't exists
    if (request === 'update' || request === 'replace') {
      request += 'One';
    }

    for (let i = 0; i < documentsNumber; i++) {
      const document = documents[i];
      // do the request on the documents individually
      const doc: IndexableDocument = await document[request](...args);

      documentsAfterRequest.push(doc);
    }

    return documentsAfterRequest;
  }

  private reject(message: string | Error): Promise<void> {
    return new Promise((_, reject) => {
      reject(message);
    });
  }

}
