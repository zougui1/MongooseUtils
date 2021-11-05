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

function constructor(originalCtor: Function) {
  Object
    // get the name of all the properties of the original constructor
    .getOwnPropertyNames(originalCtor.prototype)
    // filter to only get constructors
    .filter(name => /constructor_[0-9]+/.test(name))
    .forEach(methodName => {
      const property = originalCtor.prototype[methodName];

      // verify that the property is a function, then call it if it is
      if (typeof property === 'function') {
        (property as Function).apply(originalCtor.prototype, [])
      }
    });
}

export function Mixin(baseCtors: Function[]) {
  return function (derivedCtor: Function) {
    baseCtors.forEach((baseCtor, i) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        let newName = name;

        // if the current property is a constructor we want to conserve it but
        // with a different name so it can be defined
        if (name === 'constructor') {
          newName = 'constructor_' + i;
        }

        Object.defineProperty(derivedCtor.prototype, newName, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) as any);
      });
    });

    // define a function in the derived constructor that will call all the other constructors
    Object.defineProperty(derivedCtor.prototype, 'constructorCaller', Object.getOwnPropertyDescriptor(constructor.prototype, 'constructor') as any);
  };
}
