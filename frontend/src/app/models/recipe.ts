export interface Recipe {
  id: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  imageId?: number | null; // Only present for custom recipes if they have an image
  image: string;
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
