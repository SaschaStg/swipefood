import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

const randomBytesP = promisify(randomBytes);

@Injectable()
export class DemoService {
  async initializeDemo() {
    // Create demo users
    const users = [
      {
        username: 'mustermax',
        password: await this.generatePassword(),
        displayName: 'Max Mustermann',
      },
      {
        username: 'jdoe',
        password: await this.generatePassword(),
        displayName: 'Jane Doe',
      },
      {
        username: 'foo',
        password: await this.generatePassword(),
        displayName: 'Foo Bar',
      },
    ];
    // TODO: Create users using the UserService
    // Create demo swipes
    // Create demo recipes
  }

  private async generatePassword(): Promise<string> {
    const bytes = await randomBytesP(16);
    return bytes.toString('base64');
  }
}
