import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiBadRequestResponse({ description: 'Username already taken' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    if (
      !(await this.authService.isUsernameAvailable(registerUserDto.username))
    ) {
      throw new BadRequestException('Username already taken');
    }
    return this.authService.register(registerUserDto);
  }
}
