interface CustomQuery {
  entries: IHash<any>;
}

interface SpecialArgs {
  limit: number;
  skip: number;
}

declare interface IQuery {
  methodName: string;
  modelName: string;
  methodExtension?: string;
  methodAddon: string;
  args: any[];
  customQuery: CustomQuery;
  specialArgs: SpecialArgs;
}
