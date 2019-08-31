import _ from 'lodash';

export const getType = (element: any, strict: any) => {
  return strict ? element.constructor.name : typeof element;
}

export const isStringOrNumber = (element: any) => _.isString(element) || _.isNumber(element);

export const isPropInObject = (propName: any, object: any): any => {
  for (const key in object) {
    if(typeof propName === 'object') return isPropInObject(propName, object[key]);
    else if(propName === key) return true;
  }
  return false;
}

export function Mixin(baseCtors: Function[]) {
   return function (derivedCtor: Function) {
     baseCtors.forEach(baseCtor => {
       Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) as any);
      });
         /*Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
         });*/
      });
   };
}
