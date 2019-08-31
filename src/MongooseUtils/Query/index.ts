
import { CacheManager } from './CacheManager';
import { BaseQuery } from './BaseQuery';
import { Mixin } from '../../utils';


@Mixin([BaseQuery, CacheManager])
export class Query {

}

export interface Query extends CacheManager, BaseQuery { }

// every mixins between the first argument and the last one are inherited by the last one, which is itself inherited by the first argument
//const Query = mix(Utils, CacheManager, BaseQuery, superclass => class Query extends superclass {
