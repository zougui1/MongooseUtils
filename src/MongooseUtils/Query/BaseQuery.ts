import mongoose from 'mongoose';
import _ from 'lodash';
import { Mixin } from '../../utils';
import { Crud } from './CRUD';
import { Data } from '../Requests/RequestsProxyHandler/QueryBuilder';

@Mixin([Crud])
export class BaseQuery {

  data: Data;
  lastConcernedProp: any;
  query = {};

  queryOperators = ['eq', 'gt', 'gte', 'in', 'lt', 'lte', 'ne', 'nin', 'and', 'not', 'nor', 'or', 'exists', 'mod',
    'regex', 'near', 'nearSphere', 'all', 'elemMatch', 'size', 'comment', 'slice'];

  constructor(data: Data) {
    this.data = data;
  }

  /**
   * execute the query
   * @return {Promise}
   * @public
   */
  exec() {
    const { model, query } = this.data;
    const { methodName, args, specialArgs } = query;

    if (!this.request) {
      this.request = model[methodName](...args)
        .limit(specialArgs.limit)
        .skip(specialArgs.skip)
        .exec();
    }

    return this.request;
  }

  /**
   * Executes the query returning a `Promise` which will be
   * resolved with the doc(s) if there is no error.
   *
   * @param {Function} [resolve]
   * @return {this}
   * @public
   */
  then(resolve: Function) {
    this.exec().then(resolve);
    return this;
  }

  /**
   * Executes the query returning a `Promise` which will be
   * resolved with either the doc(s) or rejected with the error.
   * Like `.then()`, but only takes a rejection handler.
   *
   * @param {Function} [reject]
   * @return {this}
   * @public
   */
  catch(reject: Function) {
    this.exec().catch(reject);
    return this;
  }

  /**
   * change the query to count the amount of documents
   * @public
   */
  count() {
    this.data.query.methodName = 'countDocuments';
    return this;
  }

    /**
     * find elements in the DB with 'limit' and 'skip' depend on the specified page
     *
     * @param {Number} page: the page the user want
     * @return {this}
     * @api public
    */
  page(page: number) {
    if (!_.isSafeInteger(page)) {
      let error = `Page must be a safe integer. Got "${page}"`;

      if (_.isString(page)) {
        error += ` of type "${typeof page}"`;
      }

      throw new Error(error);
    }

    this.data.query.specialArgs.skip = ((page - 1) * this.data.query.specialArgs.limit)
    return this;
  }

  /**
   * @param {Object|Array} propsAndMatches: the props to spread '$and' and '$or' query operators, with their match cases
   * @param {any} match: element to match for all the props
   * @return {this}
   * @api public
   */
  matchesAny (propsAndMatches: any, match: any) {
    // if 'propsAndMatches' is an array, we transform it as an object with all of its props has the value of 'match'
    if (Array.isArray(propsAndMatches)) {
      const tempPropsArray = propsAndMatches.slice();
      propsAndMatches = {};
      const length = tempPropsArray.length;

      for (let i = 0; i < length; ++i) {
        propsAndMatches[tempPropsArray[i]] = match;
      }
    }
    // we want all the props and matches as arrays
    const props = Object.keys(propsAndMatches);
    const matches = Object.values(propsAndMatches);
    const length = props.length;
    // number to add to the iteration in the sub-for loop's iteration
    let addIteration = -1;
    let $and: any = [];

    for (let i = 0; i < length; ++i) {
      ++addIteration;
      $and[i] = { $or: [] };

      for (let j = 0; j < length; ++j) {
        const addJ = addIteration + j;
        // if ('addIteration' + 'j') is greater than or equal to the length of the arrays, then the wanted index would be
        // ('length' - ('j' + 1)), otherwise we want ('addIteration' + 'j') as index
        const index = addJ < length ? addJ : (length - (j + 1));
        $and[i].$or[j] = { [props[index]]: matches[index] };
      }
    }
    this.data.query.args[0].$and = $and;
    return this;
  }

};

export interface BaseQuery extends Crud {}

/*


main array, '$and' container
[values]

sub arrays, '$or' containers
[ [values], [values] ]

matching objercts, property with the value to match with
[ [{ username: 'zougui' }, { something: 'zougui' }], [{ something: 'zougui' }, { username: 'zougui' }] ]



*/
