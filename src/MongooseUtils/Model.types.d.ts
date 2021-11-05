import { Model, Document } from 'mongoose';
import { IndexableModel } from '../@types';

declare interface Models {
  [indexer: string]: IndexableModel
}
