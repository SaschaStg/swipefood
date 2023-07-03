import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SwipefoodRecipe } from '../recipes/recipe.entity';
import { User } from '../users/user.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => SwipefoodRecipe, (recipe) => recipe.image)
  recipe: SwipefoodRecipe;

  @ManyToOne(() => User, { nullable: false })
  owner: User;
}
