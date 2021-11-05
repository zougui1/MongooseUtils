import mongoose from 'mongoose';

declare interface IndexableDocument extends mongoose.Document {
  [indexer: string]: any;
}
