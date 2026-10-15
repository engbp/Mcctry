import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: 'ok'; service: 'mcc-mnu-api' } {
    return { status: 'ok', service: 'mcc-mnu-api' };
  }
}
