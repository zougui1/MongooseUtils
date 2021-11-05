import mongoose from 'mongoose';
import _ from 'lodash';
import { IndexableDocument } from '../Query/Requests.types';
import { Models } from '../Model.types';
import { RequestsProxyHandler } from './RequestsProxyHandler/index';
import { RequestsObject } from './index.types';
import { Options } from '../index.types';

export class Requests {

  requests: RequestsObject = {};

  // property from `Model`
  models: Models = {};

  // property from MongooseUtils
  options: Options = new Options();

  constructor() {
    this.createRequests();
  }

  /**
   * encapsulate the `requests` object into a `Proxy` to create request dynamically
   * @protected
   */
  protected createRequests() {
    this.requests = new Proxy({}, new RequestsProxyHandler(this.requests, this.models, this.options));
  }

  /**
   * add a request into the requests object
   * @param {String} requestName
   * @param {Function} request
   * @public
   */
  addRequest(requestName: string, request: Function) {
    this.requests[requestName] = request;
  }

};
