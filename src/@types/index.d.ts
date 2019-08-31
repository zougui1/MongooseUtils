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
