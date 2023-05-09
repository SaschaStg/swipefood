export class IngredientDto {
  id: string;
  name: string;
  amount: number;
  unit: string;

  constructor(id: string, name: string, amount: number, unit: string) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  }
}
