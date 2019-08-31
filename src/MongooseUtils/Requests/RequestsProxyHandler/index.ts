import { ProxyRequests } from './ProxyRequests';
import { RequestsObject } from '../index.types';
import { Models } from '../../Model.types';

export class RequestsProxyHandler {

  requests: RequestsObject;
  models: Models;

  /**
   * @param {RequestsObject} requests the object that's used to create requests dynamically
   * @param {Models} models object that contains all the models created by the user
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
   */
  get(target: any, name: string): Function {
    return new ProxyRequests(this.requests, this.models).makeRequest(target, name);
  }

}
