import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CredentialUpdateDto, LoginUserDto, RegisterUserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './public';
import { ReqUser } from './user.decorator';
import { User } from '../users/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse()
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user);
    res.cookie('jwt', token.access_token, {
      maxAge: 3600000, // 1 hour
      secure: this.config.get('NODE_ENV') === 'production',
    });
    return token;
  }

  @Public()
  @Post('register')
  @ApiBadRequestResponse({ description: 'Username already taken' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (
      !(await this.authService.isUsernameAvailable(registerUserDto.username))
    ) {
      throw new BadRequestException('Username already taken');
    }
    const token = await this.authService.register(registerUserDto);
    res.cookie('jwt', token.access_token, {
      maxAge: 3600000, // 1 hour
      secure: this.config.get('NODE_ENV') === 'production',
    });
    return token;
  }

  @Post('update')
  @ApiCookieAuth()
  async updateCredentials(
    @Body() credentialUpdate: CredentialUpdateDto,
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    if (!credentialUpdate.newUsername && !credentialUpdate.newPassword) {
      throw new BadRequestException('Nothing to update');
    }
    const token = await this.authService.updateCredentials(
      credentialUpdate,
      user,
    );
    res.cookie('jwt', token.access_token, {
      maxAge: 3600000, // 1 hour
      secure: this.config.get('NODE_ENV') === 'production',
    });
    return token;
  }
}
