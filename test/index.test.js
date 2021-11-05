import MongooseUtils from '../dist/MongooseUtils/index';
import chalk from 'chalk';
import '@babel/polyfill';

const Mongoose = new MongooseUtils();

const colorizer = string => {
  let parts = string.split('.');
  const _class = chalk.hex('#ffff00')(parts.shift());
  const _function = chalk.hex('#61afef')(parts.pop());
  parts = parts || [];
  const objectProps = parts.map(part => chalk.hex('#e06c75')(part));
  return (
    objectProps.length > 0
      ? [_class, objectProps, _function]
      : [_class, _function]
  ).join(chalk.hex('#56b6c2')('.'));
}

const divider = chalk.hex('#c678dd')('=>');
const and = chalk.hex('#c678dd')('&&')

const funcs = functions => {
  const funcs = functions.map(func => {
    return colorizer('Mongoose.' + (
      func.startsWith('r.')
        ? 'requests.' + func.substring(2)
        : func
    ));
  });
  return funcs.join(', ');
}

const details = details => details.map(detail => chalk.hex('#98c379')(detail)).join(', ');

const data = (functions, _details) => divider + ' ' + funcs(functions) + (_details ? ( ' ' + and + ' ' + details(_details)) : '');

describe('connect to the DB', () => {
  test(data(['connect']), () => {
    return Mongoose.connect('mongodb://zougui:fefenou919191@ds237713.mlab.com:37713/gallery');
  });
})

describe('create a model called "Test" and get it', () => {
  test(data(['createModel', 'getModel']), () => {
    Mongoose.createModel('test', {
      something: String
    })

    const TestModel = Mongoose.getModel('test');
    expect(TestModel.base.constructor.name).toBe('Mongoose');
  });
})

describe('create a new document on Test collection then find it', () => {
  test(data(['newDocument', 'r.findOneTest']), async () => {
    await Mongoose.newDocument('test', { something: 'testing string' });
    const data = await Mongoose.requests.findOneTest({ something: 'testing string' });

    expect(typeof data).toBe('object');
    expect(data.something).toBe('testing string');
  });
})

describe('create a model and attach it a method and a middleware', () => {
  test(data(['createSchema', 'newDocument', 'r.findOneSuper'], ['schema.pre', 'schema.methods']), async () => {
    const schema = Mongoose.createSchema({ something: String });
    schema.pre('save', function (next) {
      console.log('save');
      expect('save').toBe('save');
      next();
    });

    await schema.model('super', {
      methods: {
        log: function () {
          return 'method attached to the documents';
        }
      }
    });

    await Mongoose.newDocument('super', { something: 'super' });
    const data = await Mongoose.requests.findOneSuper({ something: 'super' });
    expect(data.log()).toBe('method attached to the documents');
    expect(data.something).toBe('super');
  });
})
