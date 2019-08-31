import { Model, Document } from 'mongoose';

declare interface Models {
  [indexer: string]: Model<Document, {}>
}
