import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsSwipefoodId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSwipefoodId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        ...validationOptions,
        message: '$property must be a valid Swipefood ID',
      },
      validator: {
        validate(
          id: any,
          validationArguments?: ValidationArguments,
        ): Promise<boolean> | boolean {
          if (typeof id !== 'string') {
            return false;
          }
          const [collection, idStr] = id.split('-');
          if (collection !== 'sw') {
            return false;
          }
          if (isNaN(+idStr)) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
