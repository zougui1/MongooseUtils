import { BaseMongoose } from './BaseMongoose';
import { Requests } from './Requests/index';
import { Model } from './Model';
import { Document } from './Document';
import { Query } from './Query';
import { CacheInitializer } from './Query/CacheInitializer';
import { Mixin } from '../utils'
import { Options } from './index.types';
import { RequestsObject } from './Requests/index.types';

//TODO: move the model-related methods from BaseMongoose to a model-specific mixin

@Mixin([BaseMongoose, Model, Requests, Document, Query, CacheInitializer])
export class MongooseUtils {

  /**
   * properties aren't defined in the prototype of the objects but defined in
   * the context when the constructor is called, so since `Mixin` only get
   * the properties defined in the prototype, we need to redefine them all
   * in the context of the original object
   */

  // property from MongooseUtils
  options: Options;

  // property from Model and BaseMongoose
  models = {};

  // properties from Requests
  methods = ['find', 'delete', 'remove', 'update', 'replace'];
  methodExtensions = ['One', 'Many'];
  methodAddons = ['ById', 'AndDelete', 'AndRemove', 'AndUpdate', 'AndReplace'];
  notLimitable = ['delete', 'remove', 'update', 'replace'];
  requests: RequestsObject = {};

  // property from Document
  excludedProps = [
    'type', 'required', 'default', 'select', 'validate', 'get', 'set', 'alias', 'index', 'unique',
    'sparse', 'lowercase','uppercase', 'trim', 'match', 'enum', 'minlength', 'maxlength', 'min', 'max'
  ];

  // properties from BaseQuery
  lastConcernedProp: any;
  query = {};
  queryOperators = ['eq', 'gt', 'gte', 'in', 'lt', 'lte', 'ne', 'nin', 'and', 'not', 'nor', 'or', 'exists', 'mod',
    'regex', 'near', 'nearSphere', 'all', 'elemMatch', 'size', 'comment', 'slice'];

  constructor(options = new Options()) {
    this.options = options;

    // methods called by the mixins' constructor must be called here

    // method from `Requests`
    this.createRequests();
    // method from `BaseMongoose`
    this.configurator();
    /*const constructors = Object
      .getOwnPropertyNames(MongooseUtils.prototype)
      .filter(name => /constructor_[0-9]+/.test(name))
      .forEach(methodName => {
        const field = this[methodName];
        if (typeof field === 'function') {
          (field as Function).apply(this, options)
        }
      });*/
    this.constructorCaller(MongooseUtils);
  }
}

// console.log(Object.getOwnPropertySymbols(MongooseUtils.prototype))
/*
console.log(Object.getOwnPropertyNames(Query.prototype));
console.log(Object.getOwnPropertyNames(MongooseUtils.prototype));*/

export interface MongooseUtils extends Model, BaseMongoose, Requests, Document, Query, CacheInitializer {
  [indexer: string]: any;
}

// every mixins between the first argument and the last one are inherited by the last one, which is itself inherited by the first argument
/*
const MongooseUtils = mix(Utils, Model, Document, Requests, BaseMongoose, Query, CacheInitializer, CacheManager, superclass => class MongooseUtils extends superclass {
  constructor(options) {
    super(options);
  }
});
*/
