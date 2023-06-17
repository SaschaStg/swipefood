import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SwipefoodIngredient } from './ingredient.entity';
import { User } from '../users/user.entity';

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

  // TODO
  //image: Image;

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
