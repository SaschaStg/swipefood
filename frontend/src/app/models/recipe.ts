export interface Recipe {
  id: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  imageType: string;
  summary: string;
  instructions: string;
  categories: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  ingredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
  }[];
}
