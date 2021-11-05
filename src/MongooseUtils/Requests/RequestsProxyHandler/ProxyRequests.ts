import mongoose from 'mongoose';
import _ from 'lodash';
import { IndexableDocument } from '../../Query/Requests.types';
import { Models } from '../../Model.types';
import { RequestsObject } from '../index.types';
import { Debugs } from '../../Debugs';
import { QueryBuilder } from './QueryBuilder';
import { Options } from '../../index.types';


export class ProxyRequests {

  /**
   * need to have the data in a static property due to the **instances** of this object
   * being in a proxy, accessing to the properties goes via the proxy, and thus
   * the property can't be modified since they get redifined in the proxy handler
   * that'll return the wanted properties
  */
  private static queryBuilder: QueryBuilder;

  /**
   * @param {RequestsObject} requests
   * @param {Models} models
   * @public
   */
  constructor(requests: RequestsObject, models: Models, options: Options) {
    ProxyRequests.queryBuilder = new QueryBuilder(requests, models, options);
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
    console.log(target)
    if (_.isSymbol(name)) {
      throw new Error('You must call the request');
    }

    if (target[name]) {
      return target[name];
    }

    return ProxyRequests.queryBuilder.buildQuery(target, name);
  }

}

export interface ProxyRequests {
  [indexer: string]: any;
}
