
import { CacheManager } from './CacheManager';
import { BaseQuery } from './BaseQuery';
import { Mixin } from '../../utils';
import { Options } from '../index.types';
import { Data } from '../Requests/RequestsProxyHandler/QueryBuilder';


@Mixin([BaseQuery, CacheManager])
export class Query {

  data: Data;
  error?: string | Error;
  request: any;

  /**
   * @param {Data} data
   */
  constructor(data: Data) {
    this.data = data;
  }
}

export interface Query extends CacheManager, BaseQuery { }

// every mixins between the first argument and the last one are inherited by the last one, which is itself inherited by the first argument
//const Query = mix(Utils, CacheManager, BaseQuery, superclass => class Query extends superclass {
