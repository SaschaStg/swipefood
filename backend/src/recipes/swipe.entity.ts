import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Swipe {
  @PrimaryColumn()
  recipeId: string;

  @Column()
  isLiked: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
