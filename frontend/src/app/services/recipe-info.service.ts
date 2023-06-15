import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeInfoService {

  /*
  getRecipeInfo(): Observable< > {
    return of({});
  }
  */
  dateInfo = {
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true,
    "dairyFree": false,
    "veryHealthy": true,
    "cheap": false,
    "veryPopular": false,
    "sustainable": false,
    "lowFodmap": false,
    "weightWatcherSmartPoints": 27,
    "gaps": "no",
    "preparationMinutes": -1,
    "cookingMinutes": -1,
    "aggregateLikes": 0,
    "healthScore": 75,
    "creditsText": "maplewoodroad",
    "license": "spoonacular's terms",
    "sourceName": "Maplewood Road",
    "pricePerServing": 1050.21,
    "extendedIngredients": [
      {
        "id": 5006,
        "aisle": "Meat",
        "image": "whole-chicken.jpg",
        "consistency": "SOLID",
        "name": "chicken spinach m zarella",
        "nameClean": "whole chicken",
        "original": "Chicken Spinach Mozzarella",
        "originalName": "Chicken Spinach M zarella",
        "amount": 1.0,
        "unit": "oz",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "oz",
            "unitLong": "ounce"
          },
          "metric": {
            "amount": 28.35,
            "unitShort": "g",
            "unitLong": "grams"
          }
        }
      },
      {
        "id": 4582,
        "aisle": "Oil, Vinegar, Salad Dressing",
        "image": "vegetable-oil.jpg",
        "consistency": "LIQUID",
        "name": "cooking is considered a joy",
        "nameClean": "cooking oil",
        "original": "Cooking is considered a joy for some, a chore for others, and a necessity for the rest. Which one are you? And why? ",
        "originalName": "Cooking is considered a joy for some, a chore for others, and a necessity for the rest. Which one are you? And why",
        "amount": 4.0,
        "unit": "servings",
        "meta": [
          "for some, a chore for others, and a necessity for the rest. which one are you? and why? "
        ],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "chicken breast",
        "nameClean": "chicken breast",
        "original": "A chicken breast, a chunk of fresh mozzarella, and a package of frozen spinach. ",
        "originalName": "A chicken breast, a chunk of fresh m zarella, and a package of frozen spinach",
        "amount": 1.0,
        "unit": "oz",
        "meta": [
          "fresh",
          "frozen",
          "chunk"
        ],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "oz",
            "unitLong": "ounce"
          },
          "metric": {
            "amount": 28.35,
            "unitShort": "g",
            "unitLong": "grams"
          }
        }
      },
      {
        "id": 1059003,
        "aisle": "Produce",
        "image": "red-delicious-apples.png",
        "consistency": "SOLID",
        "name": "i saw a delicious",
        "nameClean": "red delicious apple",
        "original": "I saw a delicious, healthy, tasty, budget-friendly, and highly adaptable meal coming together in no time.",
        "originalName": "I saw a delicious, healthy, tasty, budget-friendly, and highly adaptable meal coming together in no time",
        "amount": 4.0,
        "unit": "servings",
        "meta": [],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "chicken breast",
        "nameClean": "chicken breast",
        "original": "10 oz chicken breast, cut into 2\" pieces",
        "originalName": "chicken breast, cut into 2\" pieces",
        "amount": 10.0,
        "unit": "oz",
        "meta": [
          "cut into 2\" pieces"
        ],
        "measures": {
          "us": {
            "amount": 10.0,
            "unitShort": "oz",
            "unitLong": "ounces"
          },
          "metric": {
            "amount": 283.495,
            "unitShort": "g",
            "unitLong": "grams"
          }
        }
      },
      {
        "id": 4669,
        "aisle": "Oil, Vinegar, Salad Dressing",
        "image": "vegetable-oil.jpg",
        "consistency": "LIQUID",
        "name": "vegetable oil",
        "nameClean": "vegetable oil",
        "original": "1 tablespoon vegetable oil",
        "originalName": "vegetable oil",
        "amount": 1.0,
        "unit": "tablespoon",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "Tbsp",
            "unitLong": "Tbsp"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "Tbsp",
            "unitLong": "Tbsp"
          }
        }
      },
      {
        "id": 2028,
        "aisle": "Spices and Seasonings",
        "image": "paprika.jpg",
        "consistency": "SOLID",
        "name": "paprika",
        "nameClean": "paprika",
        "original": "1 teaspoon paprika",
        "originalName": "paprika",
        "amount": 1.0,
        "unit": "teaspoon",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "tsp",
            "unitLong": "teaspoon"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "tsp",
            "unitLong": "teaspoon"
          }
        }
      },
      {
        "id": 1082047,
        "aisle": "Spices and Seasonings",
        "image": "salt.jpg",
        "consistency": "SOLID",
        "name": "kosher salt",
        "nameClean": "kosher salt",
        "original": "½ teaspoon kosher salt",
        "originalName": "kosher salt",
        "amount": 0.5,
        "unit": "teaspoon",
        "meta": [],
        "measures": {
          "us": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          },
          "metric": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          }
        }
      },
      {
        "id": 1002030,
        "aisle": "Spices and Seasonings",
        "image": "pepper.jpg",
        "consistency": "SOLID",
        "name": "freshly cracked pepper",
        "nameClean": "black pepper",
        "original": "½ teaspoon freshly cracked black pepper",
        "originalName": "freshly cracked black pepper",
        "amount": 0.5,
        "unit": "teaspoon",
        "meta": [
          "black"
        ],
        "measures": {
          "us": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          },
          "metric": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          }
        }
      },
      {
        "id": 11463,
        "aisle": "Frozen",
        "image": "spinach-frozen.jpg",
        "consistency": "SOLID",
        "name": "spinach",
        "nameClean": "frozen spinach",
        "original": "10 oz frozen, chopped spinach",
        "originalName": "frozen, chopped spinach",
        "amount": 10.0,
        "unit": "oz",
        "meta": [
          "frozen",
          "chopped"
        ],
        "measures": {
          "us": {
            "amount": 10.0,
            "unitShort": "oz",
            "unitLong": "ounces"
          },
          "metric": {
            "amount": 283.495,
            "unitShort": "g",
            "unitLong": "grams"
          }
        }
      },
      {
        "id": 4053,
        "aisle": "Oil, Vinegar, Salad Dressing",
        "image": "olive-oil.jpg",
        "consistency": "LIQUID",
        "name": "olive oil",
        "nameClean": "olive oil",
        "original": "1 tablespoon olive oil",
        "originalName": "olive oil",
        "amount": 1.0,
        "unit": "tablespoon",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "Tbsp",
            "unitLong": "Tbsp"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "Tbsp",
            "unitLong": "Tbsp"
          }
        }
      },
      {
        "id": 11677,
        "aisle": "Produce",
        "image": "shallots.jpg",
        "consistency": "SOLID",
        "name": "shallot",
        "nameClean": "shallot",
        "original": "1 shallot, chopped",
        "originalName": "shallot, chopped",
        "amount": 1.0,
        "unit": "",
        "meta": [
          "chopped"
        ],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "",
            "unitLong": ""
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "",
            "unitLong": ""
          }
        }
      },
      {
        "id": 2015,
        "aisle": "Spices and Seasonings",
        "image": "curry-powder.jpg",
        "consistency": "SOLID",
        "name": "curry powder",
        "nameClean": "curry powder",
        "original": "1 teaspoon curry powder",
        "originalName": "curry powder",
        "amount": 1.0,
        "unit": "teaspoon",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "tsp",
            "unitLong": "teaspoon"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "tsp",
            "unitLong": "teaspoon"
          }
        }
      },
      {
        "id": 2025,
        "aisle": "Spices and Seasonings",
        "image": "ground-nutmeg.jpg",
        "consistency": "SOLID",
        "name": "nutmeg",
        "nameClean": "nutmeg",
        "original": "½ teaspoon grated nutmeg",
        "originalName": "grated nutmeg",
        "amount": 0.5,
        "unit": "teaspoon",
        "meta": [
          "grated"
        ],
        "measures": {
          "us": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          },
          "metric": {
            "amount": 0.5,
            "unitShort": "tsps",
            "unitLong": "teaspoons"
          }
        }
      },
      {
        "id": 1077,
        "aisle": "Milk, Eggs, Other Dairy",
        "image": "milk.png",
        "consistency": "LIQUID",
        "name": "milk and/or stock",
        "nameClean": "milk",
        "original": "¼ c milk and/or your favorite stock",
        "originalName": "milk and/or your favorite stock",
        "amount": 0.25,
        "unit": "c",
        "meta": [
          "your favorite"
        ],
        "measures": {
          "us": {
            "amount": 0.25,
            "unitShort": "cups",
            "unitLong": "cups"
          },
          "metric": {
            "amount": 59.147,
            "unitShort": "ml",
            "unitLong": "milliliters"
          }
        }
      },
      {
        "id": 1026,
        "aisle": "Cheese",
        "image": "mozzarella.png",
        "consistency": "SOLID",
        "name": "mozzarella",
        "nameClean": "mozzarella",
        "original": "6 oz mozzarella, cut into ¼\" slices",
        "originalName": "mozzarella, cut into ¼\" slices",
        "amount": 6.0,
        "unit": "oz",
        "meta": [
          "cut into ¼\" slices"
        ],
        "measures": {
          "us": {
            "amount": 6.0,
            "unitShort": "oz",
            "unitLong": "ounces"
          },
          "metric": {
            "amount": 170.097,
            "unitShort": "g",
            "unitLong": "grams"
          }
        }
      },
      {
        "id": 1129,
        "aisle": "Milk, Eggs, Other Dairy",
        "image": "hard-boiled-egg.png",
        "consistency": "SOLID",
        "name": "hardboiled eggs",
        "nameClean": "hard boiled egg",
        "original": "2 hard-boiled eggs",
        "originalName": "hard-boiled eggs",
        "amount": 2.0,
        "unit": "",
        "meta": [],
        "measures": {
          "us": {
            "amount": 2.0,
            "unitShort": "",
            "unitLong": ""
          },
          "metric": {
            "amount": 2.0,
            "unitShort": "",
            "unitLong": ""
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "chicken breasts",
        "nameClean": "chicken breast",
        "original": "Chicken Breasts",
        "originalName": "Chicken Breasts",
        "amount": 4.0,
        "unit": "servings",
        "meta": [],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "seasoning the chicken breasts",
        "nameClean": "chicken breast",
        "original": "Seasoning The Chicken Breasts ",
        "originalName": "Seasoning The Chicken Breasts",
        "amount": 4.0,
        "unit": "servings",
        "meta": [],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "as mentioned before",
        "nameClean": "chicken breast",
        "original": "As mentioned before, chicken breast is very “flavor neutral.” We have to add some character to it without over-seasoning and therefore dominating the dish. ",
        "originalName": "As mentioned before, chicken breast is very “flavor neutral.” We have to add some character to it without over-seasoning and therefore dominating the dish",
        "amount": 4.0,
        "unit": "servings",
        "meta": [],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": 5062,
        "aisle": "Meat",
        "image": "chicken-breasts.png",
        "consistency": "SOLID",
        "name": "cooking the chicken breast",
        "nameClean": "chicken breast",
        "original": "Cooking The Chicken Breast",
        "originalName": "Cooking The Chicken Breast",
        "amount": 4.0,
        "unit": "servings",
        "meta": [],
        "measures": {
          "us": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          },
          "metric": {
            "amount": 4.0,
            "unitShort": "servings",
            "unitLong": "servings"
          }
        }
      },
      {
        "id": -1,
        "aisle": "?",
        "image": null,
        "consistency": "SOLID",
        "name": "january 12",
        "nameClean": null,
        "original": "January 12, 2022 by Erich Boenzli",
        "originalName": "January 12, by Erich Boenzli",
        "amount": 2022.0,
        "unit": "",
        "meta": [],
        "measures": {
          "us": {
            "amount": 2022.0,
            "unitShort": "",
            "unitLong": ""
          },
          "metric": {
            "amount": 2022.0,
            "unitShort": "",
            "unitLong": ""
          }
        }
      },
      {
        "id": -1,
        "aisle": "?",
        "image": null,
        "consistency": "SOLID",
        "name": "the three most common excuses",
        "nameClean": null,
        "original": "The three most common excuses for not cooking I hear are “I don’t have time,” “I don’t feel like it,” and “I don’t know what to cook.” ",
        "originalName": "The three most common excuses for not cooking I hear are “I don't have time,” “I don't feel like it,” and “I don't know what to cook",
        "amount": 1.0,
        "unit": "serving",
        "meta": [
          "for not cooking i hear are “i don't have time,” “i don't feel like it,” and “i don't know what to cook.” "
        ],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "serving",
            "unitLong": "serving"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "serving",
            "unitLong": "serving"
          }
        }
      },
      {
        "id": -1,
        "aisle": "?",
        "image": null,
        "consistency": "SOLID",
        "name": "occasionally",
        "nameClean": null,
        "original": "Occasionally, I’ll write up a real life situation like the one below and walk you step-by-step through the process to have a successful dinner on the table in just over 30 minutes. ",
        "originalName": "Occasionally, I'll write up a real life situation like the one below and walk you step-by-step through the process to have a successful dinner on the table in just over minutes",
        "amount": 30.0,
        "unit": "",
        "meta": [],
        "measures": {
          "us": {
            "amount": 30.0,
            "unitShort": "",
            "unitLong": ""
          },
          "metric": {
            "amount": 30.0,
            "unitShort": "",
            "unitLong": ""
          }
        }
      },
      {
        "id": -1,
        "aisle": "?",
        "image": null,
        "consistency": "SOLID",
        "name": "additional",
        "nameClean": null,
        "original": "Additional",
        "originalName": "Additional",
        "amount": 1.0,
        "unit": "serving",
        "meta": [],
        "measures": {
          "us": {
            "amount": 1.0,
            "unitShort": "serving",
            "unitLong": "serving"
          },
          "metric": {
            "amount": 1.0,
            "unitShort": "serving",
            "unitLong": "serving"
          }
        }
      }
    ],
    "id": 1697831,
    "title": "Chicken Spinach Mozzarella",
    "author": "maplewoodroad",
    "readyInMinutes": 45,
    "servings": 4,
    "sourceUrl": "https://maplewoodroad.com/chicken-spinach-mozzarella/",
    "image": "https://spoonacular.com/recipeImages/1697831-556x370.jpg",
    "imageType": "jpg",
    "summary": "Need a <b>gluten free main course</b>? Chicken Spinach Mozzarella could be an amazing recipe to try. This recipe makes 4 servings with <b>1550 calories</b>, <b>225g of protein</b>, and <b>60g of fat</b> each. For <b>$10.5 per serving</b>, this recipe <b>covers 60%</b> of your daily requirements of vitamins and minerals. This recipe from spoonacular user <a href=\"/profile/maplewoodroad\">maplewoodroad</a> requires hardboiled eggs, as mentioned before, january 12, and additional. From preparation to the plate, this recipe takes around <b>45 minutes</b>. <a href=\"https://spoonacular.com/recipes/chicken-with-spinach-and-mozzarella-in-tomato-sauce-669147\">Chicken with Spinach and Mozzarellan in Tomato Sauce</a>, <a href=\"https://spoonacular.com/recipes/grilled-chicken-with-spinach-and-melted-mozzarella-1494043\">Grilled Chicken with Spinach and Melted Mozzarella</a>, and <a href=\"https://spoonacular.com/recipes/crispy-mozzarella-chicken-with-garlic-spinach-546498\">Crispy Mozzarella Chicken with Garlic Spinach</a> are very similar to this recipe.",
    "cuisines": [],
    "dishTypes": [
      "lunch",
      "main course",
      "main dish",
      "dinner"
    ],
    "diets": [
      "gluten free"
    ],
    "occasions": [],
    "winePairing": {
      "pairedWines": [],
      "pairingText": "",
      "productMatches": []
    },
    "instructions": "05:00 Reduce heat to low and add frozen spinach. Add 1 tablespoon vegetable oil to an oven-safe pan and bring to medium heat. \n\n\n08:00 Add seasoned, chopped chicken to the pan. Occasionally stir spinach.\n\n11:00 Turn chicken. Stir spinach.\n\n14:00 Turn on the broiler in the oven. Make sure the baking rack is in the upper half. Check chicken and set aside if done.\n\n20:00 Add milk and/or stock to the spinach and finish by seasoning and tasting it.\n\n21:00 Spread the cooked spinach around the oven-safe pan. Place the chicken and hard-boiled eggs on top. Add the mozzarella and stick it under the broiler.\n\n25:00 Remove the pan from the oven and serve. Actually, look at it first and be proud of yourself for what you just created. \n\n(Photo by Erich Boenzli)\n\nLove easy, delicious dinners? Check out more of our recipes now:\n\nScaloppine al Limone\n\nSalt And Pepper Chicken\n\nCreamy Balsamic Chicken With Mushrooms And Parsley\n\nBuffalo Chicken Thighs\n\nPanera Spicy Thai Salad\n\nRoasted Tomato And White Bean Stew\n\nJulia Child's Beef Bourguignon Recipe, Simplified\n\nPan Seared Honey Glazed Salmon With Collard Greens\n\nMushroom Risotto With Parmigiano Reggiano And Fresh Italian Parsley\n\nSheet Pan Dinner: Hanger Steak With Mushrooms And Carrots\n\nDid you make this Chicken Spinach Mozzarella? Let us know in the comments below!",
    "analyzedInstructions": [
      {
        "name": "",
        "steps": [
          {
            "number": 1,
            "step": "00 Reduce heat to low and add frozen spinach.",
            "ingredients": [
              {
                "id": 11463,
                "name": "frozen spinach",
                "localizedName": "frozen spinach",
                "image": "spinach-frozen.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 2,
            "step": "Add 1 tablespoon vegetable oil to an oven-safe pan and bring to medium heat. ",
            "ingredients": [
              {
                "id": 4669,
                "name": "vegetable oil",
                "localizedName": "vegetable oil",
                "image": "vegetable-oil.jpg"
              }
            ],
            "equipment": [
              {
                "id": 404784,
                "name": "oven",
                "localizedName": "oven",
                "image": "oven.jpg"
              },
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 3,
            "step": "Add seasoned, chopped chicken to the pan. Occasionally stir spinach.",
            "ingredients": [
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              },
              {
                "id": 10011457,
                "name": "spinach",
                "localizedName": "spinach",
                "image": "spinach.jpg"
              }
            ],
            "equipment": [
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 4,
            "step": "00 Turn chicken. Stir spinach.",
            "ingredients": [
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              },
              {
                "id": 10011457,
                "name": "spinach",
                "localizedName": "spinach",
                "image": "spinach.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 5,
            "step": "00 Turn on the broiler in the oven. Make sure the baking rack is in the upper half. Check chicken and set aside if done.",
            "ingredients": [
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              }
            ],
            "equipment": [
              {
                "id": 405914,
                "name": "broiler",
                "localizedName": "broiler",
                "image": "oven.jpg"
              },
              {
                "id": 404784,
                "name": "oven",
                "localizedName": "oven",
                "image": "oven.jpg"
              }
            ]
          },
          {
            "number": 6,
            "step": "Add milk and/or stock to the spinach and finish by seasoning and tasting it.",
            "ingredients": [
              {
                "id": 1042027,
                "name": "seasoning",
                "localizedName": "seasoning",
                "image": "seasoning.png"
              },
              {
                "id": 10011457,
                "name": "spinach",
                "localizedName": "spinach",
                "image": "spinach.jpg"
              },
              {
                "id": 1006615,
                "name": "stock",
                "localizedName": "stock",
                "image": "chicken-broth.png"
              },
              {
                "id": 1077,
                "name": "milk",
                "localizedName": "milk",
                "image": "milk.png"
              }
            ],
            "equipment": []
          },
          {
            "number": 7,
            "step": "Spread the cooked spinach around the oven-safe pan.",
            "ingredients": [
              {
                "id": 10011457,
                "name": "spinach",
                "localizedName": "spinach",
                "image": "spinach.jpg"
              },
              {
                "id": 0,
                "name": "spread",
                "localizedName": "spread",
                "image": ""
              }
            ],
            "equipment": [
              {
                "id": 404784,
                "name": "oven",
                "localizedName": "oven",
                "image": "oven.jpg"
              },
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 8,
            "step": "Place the chicken and hard-boiled eggs on top.",
            "ingredients": [
              {
                "id": 1129,
                "name": "hard boiled egg",
                "localizedName": "hard boiled egg",
                "image": "hard-boiled-egg.png"
              },
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 9,
            "step": "Add the mozzarella and stick it under the broiler.",
            "ingredients": [
              {
                "id": 1026,
                "name": "mozzarella",
                "localizedName": "mozzarella",
                "image": "mozzarella.png"
              }
            ],
            "equipment": [
              {
                "id": 405914,
                "name": "broiler",
                "localizedName": "broiler",
                "image": "oven.jpg"
              }
            ]
          },
          {
            "number": 10,
            "step": "Remove the pan from the oven and serve. Actually, look at it first and be proud of yourself for what you just created. ",
            "ingredients": [],
            "equipment": [
              {
                "id": 404784,
                "name": "oven",
                "localizedName": "oven",
                "image": "oven.jpg"
              },
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 11,
            "step": "(Photo by Erich Boenzli)",
            "ingredients": [],
            "equipment": []
          }
        ]
      },
      {
        "name": "Love easy, delicious dinners? Check out more of our recipes now",
        "steps": [
          {
            "number": 1,
            "step": "Scaloppine al Limone",
            "ingredients": [],
            "equipment": []
          },
          {
            "number": 2,
            "step": "Salt And Pepper Chicken",
            "ingredients": [
              {
                "id": 1102047,
                "name": "salt and pepper",
                "localizedName": "salt and pepper",
                "image": "salt-and-pepper.jpg"
              },
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 3,
            "step": "Creamy Balsamic Chicken With Mushrooms And Parsley",
            "ingredients": [
              {
                "id": 11260,
                "name": "mushrooms",
                "localizedName": "mushrooms",
                "image": "mushrooms.png"
              },
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              },
              {
                "id": 11297,
                "name": "parsley",
                "localizedName": "parsley",
                "image": "parsley.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 4,
            "step": "Buffalo Chicken Thighs",
            "ingredients": [
              {
                "id": 0,
                "name": "buffalo chicken",
                "localizedName": "buffalo chicken",
                "image": "whole-chicken.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 5,
            "step": "Panera Spicy Thai Salad",
            "ingredients": [],
            "equipment": []
          },
          {
            "number": 6,
            "step": "Roasted Tomato And White Bean Stew",
            "ingredients": [
              {
                "id": 11529,
                "name": "tomato",
                "localizedName": "tomato",
                "image": "tomato.png"
              },
              {
                "id": 0,
                "name": "stew",
                "localizedName": "stew",
                "image": ""
              }
            ],
            "equipment": []
          },
          {
            "number": 7,
            "step": "Julia Child's Beef Bourguignon Recipe, Simplified",
            "ingredients": [
              {
                "id": 23572,
                "name": "beef",
                "localizedName": "beef",
                "image": "beef-cubes-raw.png"
              }
            ],
            "equipment": []
          },
          {
            "number": 8,
            "step": "Pan Seared Honey Glazed Salmon With Collard Greens",
            "ingredients": [
              {
                "id": 11161,
                "name": "collard greens",
                "localizedName": "collard greens",
                "image": "collard-greens.jpg"
              },
              {
                "id": 15076,
                "name": "salmon",
                "localizedName": "salmon",
                "image": "salmon.png"
              },
              {
                "id": 19296,
                "name": "honey",
                "localizedName": "honey",
                "image": "honey.png"
              }
            ],
            "equipment": [
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 9,
            "step": "Mushroom Risotto With Parmigiano Reggiano And Fresh Italian Parsley",
            "ingredients": [
              {
                "id": 10211297,
                "name": "fresh flat leaf parsley",
                "localizedName": "fresh flat leaf parsley",
                "image": "parsley.jpg"
              },
              {
                "id": 1033,
                "name": "parmigiano reggiano",
                "localizedName": "parmigiano reggiano",
                "image": "parmesan.jpg"
              },
              {
                "id": 11260,
                "name": "mushrooms",
                "localizedName": "mushrooms",
                "image": "mushrooms.png"
              }
            ],
            "equipment": []
          },
          {
            "number": 10,
            "step": "Sheet Pan Dinner: Hanger Steak With Mushrooms And Carrots",
            "ingredients": [
              {
                "id": 11260,
                "name": "mushrooms",
                "localizedName": "mushrooms",
                "image": "mushrooms.png"
              },
              {
                "id": 11124,
                "name": "carrot",
                "localizedName": "carrot",
                "image": "sliced-carrot.png"
              },
              {
                "id": 23232,
                "name": "steak",
                "localizedName": "steak",
                "image": "ribeye-raw.jpg"
              }
            ],
            "equipment": [
              {
                "id": 404645,
                "name": "frying pan",
                "localizedName": "frying pan",
                "image": "pan.png"
              }
            ]
          },
          {
            "number": 11,
            "step": "Did you make this Chicken Spinach Mozzarella?",
            "ingredients": [
              {
                "id": 1026,
                "name": "mozzarella",
                "localizedName": "mozzarella",
                "image": "mozzarella.png"
              },
              {
                "id": 5006,
                "name": "whole chicken",
                "localizedName": "whole chicken",
                "image": "whole-chicken.jpg"
              },
              {
                "id": 10011457,
                "name": "spinach",
                "localizedName": "spinach",
                "image": "spinach.jpg"
              }
            ],
            "equipment": []
          },
          {
            "number": 12,
            "step": "Let us know in the comments below!",
            "ingredients": [],
            "equipment": []
          }
        ]
      }
    ],
    "originalId": null,
    "spoonacularSourceUrl": "https://spoonacular.com/chicken-spinach-mozzarella-1697831"
  }
}
