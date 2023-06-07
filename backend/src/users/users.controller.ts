import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DietUpdateDto } from './dto';
import { User } from './user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me/diet')
  async updateDiet(
    @Body() dietUpdate: DietUpdateDto,
    @Request() req,
  ): Promise<User> {
    return this.usersService.updateDiet(req.user.id, dietUpdate);
  }
}
