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
import { CredentialUpdateDto, LoginUserDto, RegisterUserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './public';
import { ReqUser } from './user.decorator';
import { User } from '../users/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
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

  @Post('update')
  @ApiBearerAuth()
  async updateCredentials(
    @Body() credentialUpdate: CredentialUpdateDto,
    @ReqUser() user: User,
  ): Promise<{ access_token: string }> {
    if (!credentialUpdate.newUsername && !credentialUpdate.newPassword) {
      throw new BadRequestException('Nothing to update');
    }
    return this.authService.updateCredentials(credentialUpdate, user);
  }
}
