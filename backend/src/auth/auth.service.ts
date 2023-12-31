import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserLogin } from './user-login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CredentialUpdateDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  private readonly argonOptions: argon2.Options & { raw?: false } = {
    // Values from https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
    type: argon2.argon2id,
    memoryCost: 12288,
    timeCost: 3,
    parallelism: 1,
  };

  constructor(
    @InjectRepository(UserLogin)
    private loginRepo: Repository<UserLogin>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * This method checks username and password using records in the database.
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string): Promise<any> {
    const login = await this.loginRepo.findOne({
      where: { username },
      relations: {
        user: true,
      },
    });
    if (
      login && // Check if user exists
      (await argon2.verify(login.password, password)) // Verify password
    ) {
      // Login successful
      return login.user;
    }

    // No such user or wrong password
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      displayName: user.displayName,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    // Create user
    const user = await this.usersService.create({
      displayName: registerUserDto.displayName,
      vegan: registerUserDto.vegan,
      vegetarian: registerUserDto.vegetarian,
      glutenFree: registerUserDto.glutenFree,
      dairyFree: registerUserDto.dairyFree,
    });
    // Create user login
    const login = new UserLogin();
    login.username = registerUserDto.username;
    login.password = await argon2.hash(
      registerUserDto.password,
      this.argonOptions,
    );
    login.user = user;
    await this.loginRepo.save(login);

    return this.login(user);
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const logins = await this.loginRepo.findBy({ username });
    return logins.length === 0;
  }

  async updateCredentials(
    credentialUpdate: CredentialUpdateDto,
    user: User,
  ): Promise<{ access_token: string }> {
    const userLogin = await this.loginRepo.findOneOrFail({
      where: { user },
      relations: { user: true },
    });

    // Check if the current password is correct
    if (
      !(await argon2.verify(
        userLogin.password,
        credentialUpdate.currentPassword,
      ))
    ) {
      throw new UnauthorizedException('Wrong password');
    }

    // Update username
    if (credentialUpdate.newUsername) {
      userLogin.username = credentialUpdate.newUsername;
    }

    // Update password
    if (credentialUpdate.newPassword) {
      userLogin.password = await argon2.hash(
        credentialUpdate.newPassword,
        this.argonOptions,
      );
    }

    await this.loginRepo.save(userLogin);

    return this.login(userLogin.user);
  }
}
