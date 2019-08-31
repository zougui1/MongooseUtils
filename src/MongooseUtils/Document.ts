import _ from 'lodash';
import * as utils from '../utils';

export class Document {

  excludedProps = [
    'type', 'required', 'default', 'select', 'validate', 'get', 'set', 'alias', 'index', 'unique',
    'sparse', 'lowercase','uppercase', 'trim', 'match', 'enum', 'minlength', 'maxlength', 'min', 'max'
  ];

  //TODO: refactor
  getModelProps (object: any, parents?: any) {
    parents = parents || '';

    let props: any = [];
    for (const key in object) {
      const isExcludedProp = _.includes(this.excludedProps, key);
      if(isExcludedProp && !_.includes(props, parents)) {
        props.push(parents);
      }
      else if(object.hasOwnProperty(key)) {
        const element = object[key];
        if(typeof element === 'object') {
          props = props.concat(this.getModelProps(element, `${parents}${parents && '.'}${key}`));
        }
        else if(!isExcludedProp) props.push(`${parents}${parents && '.'}${key}`);
      }
    }
    return props;
  }

  //TODO: refactor
  newDocument (modelName: any, data: any) {
    modelName = _.capitalize(modelName);
    // @ts-ignore
    const modelTree = this.getModelProps(this.models[modelName].schema.obj);
    const model = this.createNestedObject(modelTree, data);
    // @ts-ignore
    return new this.models[modelName](model).save();
  }


  /**
   * TODO refactor
   * @param {Array} props list of the props defined in the mongoose model
   * @param {Object} data object of the data to save in the DB
   * @param {Object} obj nested object for recusivity
   * @param {any} nestedData nested data of the object data for recusivity, to save in the DB
  */
  createNestedObject (props: any, data: any, obj?: any, nestedData?: any) {
    let finalObj = obj || {};
    props.forEach((prop: any) => {
      const splitIndex = prop.indexOf('.');

      if(splitIndex === -1) {
        if(typeof nestedData === 'object') nestedData = nestedData[prop];
        const value = nestedData || data[prop];
        if(value !== undefined && value !== null) finalObj[prop] = value;
      } else {
        const firstProp = prop.substring(0, splitIndex);
        const rest = prop.substring(splitIndex + 1, prop.length);
        finalObj[firstProp] = finalObj[firstProp] || {};
        this.createNestedObject([rest], data, finalObj[firstProp], data[firstProp]);
      }
    });
    return finalObj;
  }

};
