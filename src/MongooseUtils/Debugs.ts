import _ from 'lodash';
import debug from 'debug';
import chalk from 'chalk';
import { Colors } from '../@types';

const appName = 'MongooseUtils';

const namespaceCreator = (namespaceName: string) => (name: string) => namespaceName + ':' + name;

const namespace = namespaceCreator(appName);
const mongooseUtilsDebug = debug(appName);

const color: Colors = {
  log: chalk.grey,
  info: chalk.blue,
  success: chalk.green,
  warn: chalk.hex('ff8800'),
  error: chalk.red
};

export class Debugs {

  static colorize(level: string) {
    return Debugs.color[level];
  }

  static scalarValue(dirtyValue: any) {
    let value = dirtyValue;

    if (_.isObject(value) || _.isArray(value)) {
      value = JSON.stringify(value, null, 2);
    }

    return value;
  }

  static formatter(level: string, formatter: any, ...args: any) {
    return Debugs.colorize(level)(Debugs.scalarValue(formatter), ...args);
  }

  static log(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.formatter('log', formatter, ...args));
  }

  static info(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.formatter('info', formatter, ...args));
  }

  static success(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.formatter('success', formatter, ...args));
  }

  static warn(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.formatter('warn', formatter, ...args));
  }

  static error(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.formatter('error', formatter, ...args));
  }

  static color = color;

}
