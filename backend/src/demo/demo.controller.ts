import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('demo')
@ApiBearerAuth()
export class DemoController {
  @Get('init')
  async initializeDemo() {
    return {
      message: 'Demo data initialized',
    };
  }
}
