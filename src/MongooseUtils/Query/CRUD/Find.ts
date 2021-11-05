import mongoose from 'mongoose';
import { Crud } from './';
import { IndexableModel } from '../../../@types';

export class Find {

  model: IndexableModel = new mongoose.Model();

  find(...args: any) {
    this.model.find.apply(this, args)
    return this;
  }

  findById(...args: any) {
    this.model.findById.apply(this, args)
    return this;
  }

  findByIdAndDelete(...args: any) {
    this.model.findByIdAndDelete.apply(this, args)
    return this;
  }

  findByIdAndRemove(...args: any) {
    this.model.findByIdAndRemove.apply(this, args)
    return this;
  }

  findByIdAndUpdate(...args: any) {
    this.model.findByIdAndUpdate.apply(this, args)
    return this;
  }

  findOne(...args: any) {
    this.model.findOne.apply(this, args)
    return this;
  }

  findOneAndDelete(...args: any) {
    this.model.findOneAndDelete.apply(this, args)
    return this;
  }

  findOneAndRemove(...args: any) {
    this.model.findOneAndRemove.apply(this, args)
    return this;
  }

  findOneAndUpdate(...args: any) {
    this.model.findOneAndUpdate.apply(this, args)
    return this;
  }
}
