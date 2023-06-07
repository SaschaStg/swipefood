import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { DietUpdateDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(userAttrs: Omit<User, 'id'>): Promise<User> {
    const user = new User();
    user.displayName = userAttrs.displayName;
    return this.usersRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  async updateDiet(id, dietUpdate: DietUpdateDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, dietUpdate);
    await this.usersRepo.save(user);

    return user;
  }
}
