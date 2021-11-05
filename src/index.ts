import chalk from 'chalk';
import PrettyError from 'pretty-error';
import mongoose from 'mongoose';

import { MongooseUtils } from './MongooseUtils/index';
import { Options } from './MongooseUtils/index.types';
import { Crud } from './MongooseUtils/Query/CRUD';

PrettyError.start();

console.log(chalk.blue('---------------------'));

const options = new Options();
options.mongooseOptions.debug = true

const Mongoose = new MongooseUtils(options);
// 'mongodb://zougui:fefenou919191@ds237713.mlab.com:37713/gallery'
Mongoose.connect('mongodb://zougui:fefenou919191@ds237713.mlab.com:37713/gallery')//.catch(() => process.exit(1));
Mongoose.createModel('test', {
  something: String,
  specific: String,
  stuff: String,
  test: String
});

for (let i = 0; i < 20; i++) {
  //Mongoose.newDocument('test', { something: 'string', specific: 'specific', stuff: 'stuff', test: 'test' });
}

const handle = (promiseLike: any) => {
  return promiseLike.then(console.log).catch(console.log);
}

// console.log(Mongoose.getModel('test').base.modelSchemas.test.obj);

//Mongoose.requests.replace5Test({}, { something: 'replaced' }).then(console.log).catch(console.log);
// Mongoose.requests.find5Test(Mongoose.matchesAny({ specific: 'specific', stuff: 'stuff', test: 'test' })).then(console.log).catch(console.log);
//console.log(Mongoose.requests.find5Test())

//handle(Mongoose.requests.findTest().count());
//Mongoose.requests.findTest().count().then(console.log).then(console.log).catch(console.error);
handle(Mongoose.requests.find5Test().page(5));
//Mongoose.requests.findOneTestBySomething('updated').then(console.log).catch(console.log);
//Mongoose.requests.findOneTestByWhatever('updated').then(console.log).catch(console.log);
//Mongoose.requests.find3Test().page(10).then(console.log).catch(console.log);
//Mongoose.requests.findOneTest().then(console.log).catch(console.log);
/*
Mongoose.addRequest('findAllTestReplaced', () => {
  return Mongoose.getModel('test').find({ something: 'replaced' });
})*/

// Mongoose.requests.findAllTestReplaced().then(console.log).catch(console.log)

//! in the functions' name "Test" is the collection where the requests will be done
/*
Mongoose.requests.deleteManyTest({ something: 'string' });
Mongoose.requests.findTest({ something: 'string' });
Mongoose.requests.findTestById('4abab4d78f4d4848e48c8448s');
Mongoose.requests.findOneTestAndUpdate({ something: 'string' }, { something: 'not a string' });
Mongoose.requests.updateOneTest({ something: 'string' }, { something: 'not a string' });
Mongoose.requests.deleteOneTest({ something: 'not a string' });
*/

setTimeout(() => {
  console.log(chalk.blue('---------------------'));
  process.exit(0);
}, 10000);
