interface Quantity {
  type: string;
  value: any;
}

interface MethodExtensions {
  quantity: Quantity;
}

declare interface SpecialData {
  methodExtensions: MethodExtensions;
}

declare interface Query {
  methodName: string;
  modelName: string;
  methodExtension?: string;
  methodAddon: string;
}
