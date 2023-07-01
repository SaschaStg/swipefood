export class SpoonacularIngredient {
  aisle: string;
  amount: number;
  consistency: string;
  id: number;
  image: string;
  measures: {
    metric: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
    us: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
  };
  meta: string[];
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  unit: string;
}
