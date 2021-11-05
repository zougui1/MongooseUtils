import mongoose from 'mongoose';
import { Mixin } from '../../../utils';
import { Find } from './Find';
import { Delete } from './Delete';
import { Remove } from './Remove';
import { Update } from './Update';
import { IndexableModel } from '../../../@types';
import { Debugs } from '../../Debugs';
import { Data } from '../../Requests/RequestsProxyHandler/QueryBuilder';

@Mixin([Delete, Find, Remove, Update])
export class Crud {
  constructor() {
  }
}

export interface Crud extends Find, Delete, Remove, Update {
  [indexer: string]: any;
};
