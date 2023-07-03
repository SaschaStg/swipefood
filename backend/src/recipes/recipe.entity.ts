import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @OneToOne(() => Image, (image) => image.recipe, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image?: Image;

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
