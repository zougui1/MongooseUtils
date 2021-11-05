import { ConnectionOptions } from 'mongoose';
import { IHash } from '../@types';

interface QueriesOptions {
  maxLimit: number;
}

export class Options {
  Promise?: PromiseConstructor = Promise;

  // options to set in the `mongoose.set` function
  mongooseOptions: IHash<any> = {
    useFindAndModify: false,
    useCreateIndex: true
  };

  connectOptions: ConnectionOptions = {
    useNewUrlParser: true
  };

  queries: QueriesOptions = {
    maxLimit: 200
  };
}
