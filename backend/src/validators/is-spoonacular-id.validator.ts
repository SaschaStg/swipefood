import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSpoonacularId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSpoonacularId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        ...validationOptions,
        message: '$property must be a valid Spoonacular ID',
      },
      validator: {
        validate(id: any): Promise<boolean> | boolean {
          if (typeof id !== 'string') {
            return false;
          }
          const [collection, idStr] = id.split('-');
          if (collection !== 'sp') {
            return false;
          }
          if (isNaN(+idStr)) {
            return false;
          }
        },
      },
    });
  };
}
