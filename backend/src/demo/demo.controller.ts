import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DemoService } from './demo.service';
import { Public } from '../auth/public';

@Controller('demo')
@ApiTags('demo')
@ApiBearerAuth()
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
