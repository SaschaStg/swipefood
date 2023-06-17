import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SwipefoodRecipe } from '../recipes/recipe.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ default: false })
  vegetarian: boolean;

  @Column({ default: false })
  vegan: boolean;

  @Column({ default: false })
  glutenFree: boolean;

  @Column({ default: false })
  dairyFree: boolean;

  @OneToMany(() => SwipefoodRecipe, (recipe) => recipe.user)
  recipes: SwipefoodRecipe[];
}
