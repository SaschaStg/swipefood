import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class UserLogin {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
