import { Controller, Get } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DemoService } from './demo.service';
import { Public } from '../auth/public';

@Controller('demo')
@ApiTags('demo')
@ApiCookieAuth()
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Get('init')
  @Public()
  async initializeDemo() {
    await this.demoService.initializeDemo();
    return {
      message: 'Demo data initialized',
    };
  }
}
