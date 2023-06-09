import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
