import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SwipefoodIngredient } from './ingredient.entity';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';

@Entity('recipe')
export class SwipefoodRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  readyInMinutes: number;

  @Column()
  servings: number;

  // This should be a OneToOne relationship,
  // but that implies a UNIQUE constraint which won't allow multiple recipes to not have an image
  // (null is treated as a unique value)
  // Postgres 15 does have a way to allow multiple null values, but it's not supported by TypeORM yet.
  @ManyToOne(() => Image, (image) => image.recipe, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image?: Image;

  @Column({ nullable: true })
  @Index({
    unique: true,
    // This is a workaround for not having the UNIQUE NULL NOT DISTINCT feature
    where: '"imageId" IS NOT NULL',
  })
  imageId?: number;

  @Column()
  summary: string;

  @Column()
  instructions: string;

  @Column()
  vegetarian: boolean;

  @Column()
  vegan: boolean;

  @Column()
  glutenFree: boolean;

  @Column()
  dairyFree: boolean;

  @OneToMany(() => SwipefoodIngredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    eager: true,
  })
  ingredients: SwipefoodIngredient[];

  @ManyToOne(() => User, (user) => user.recipes, { nullable: false })
  user: User;
}
