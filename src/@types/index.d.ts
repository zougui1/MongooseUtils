import mongoose, { Mongoose } from 'mongoose';
import { Chalk, ColorSupport } from 'chalk';

declare module 'mics';

declare interface IHash <T>{
  [details: string]: T;
}

declare interface Colors {
  [details: string]: Chalk & {
    supportsColor: ColorSupport
  }
}

declare interface Constructible {
  new(): any;
}

declare interface IndexableModel extends mongoose.Model<mongoose.Document> {
  [indexer: string]: any;
}
