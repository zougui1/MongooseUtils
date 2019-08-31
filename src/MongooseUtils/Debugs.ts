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

  static log(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.color.log(formatter, ...args));
  }

  static info(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.color.info(formatter, ...args));
  }

  static success(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.color.success(formatter, ...args));
  }

  static warn(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.color.warn(formatter, ...args));
  }

  static error(formatter: any, ...args: any) {
    mongooseUtilsDebug(Debugs.color.error(formatter, ...args));
  }

  static color = color;

}
