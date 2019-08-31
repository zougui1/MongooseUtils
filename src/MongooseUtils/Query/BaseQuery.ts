import mongoose from 'mongoose';

export class BaseQuery {

  lastConcernedProp: any;
  query = {};

  queryOperators = ['eq', 'gt', 'gte', 'in', 'lt', 'lte', 'ne', 'nin', 'and', 'not', 'nor', 'or', 'exists', 'mod',
    'regex', 'near', 'nearSphere', 'all', 'elemMatch', 'size', 'comment', 'slice'];

  constructor() {
    this.page();
    // uncomment when its TODO is done
    // this.matchesAny();
  }

  page () {
    /**
     * find elements in the DB with 'limit' and 'skip' depend on the specified page
     *
     * @method page
     * @param {Number} page: the page the user want
     * @return {Object}
     * @api public
    */
    // @ts-ignore
    mongoose.Query.prototype.page = function (page: any) {
      // @ts-ignore
      this.skip((page - 1) * this.options.limit)
      return this;
    }
  }

  /**
  matchesAny = () => {
    /**
     * @method
     * @param {Object|Array} propsAndMatches: the props to spread '$and' and '$or' query operators, with their match cases
     * @param {any} match: element to match for all the props
     * @return {Object}
     * @api public
     *//*
    // TODO find a way to make it usable in the query chains, knowing that the request to the DB
    // TODO is made when one of those methods is called 'find', 'update', 'remove', 'delete', 'replace'
    // TODO but this function need to be done BEFORE the request is made
    //! TO DO THIS READ THE TODOS IN "Requests" => "createRequests" METHOD
    this.mongoose.Query.prototype.matchesAny = function (propsAndMatches, match) {
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
      let $and = [];

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

      this.options.$and = { $and };
      return this;
    }
  }
  */


  /**
   * @method
   * @param {Object|Array} propsAndMatches: the props to spread '$and' and '$or' query operators, with their match cases
   * @param {any} match: element to match for all the props
   * @return {Object}
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
    return { $and };
  }

};

/*


main array, '$and' container
[values]

sub arrays, '$or' containers
[ [values], [values] ]

matching objercts, property with the value to match with
[ [{ username: 'zougui' }, { something: 'zougui' }], [{ something: 'zougui' }, { username: 'zougui' }] ]



*/
