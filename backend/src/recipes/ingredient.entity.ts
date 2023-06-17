import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SwipefoodRecipe } from './recipe.entity';

@Entity('ingredient')
export class SwipefoodIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  unit: string;

  @ManyToOne(() => SwipefoodRecipe, (recipe) => recipe.ingredients, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  recipe: SwipefoodRecipe;
}
