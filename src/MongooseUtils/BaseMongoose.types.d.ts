export interface IBaseMongoose {
  connect: (mongoURI: any, options: any) => Promise<any>
}
