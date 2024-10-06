import { Body, Controller, Post } from '@nestjs/common';
import { SnsService } from './sns.service';
import { EventExample } from 'src/enum/event-example.interface';

@Controller('sns')
export class SnsController {
  constructor(
    private readonly snsService: SnsService
  ) {}

  @Post('publish')
  async publishMessage(@Body() message: EventExample) {
    return await this.snsService.publishMessage(message);
  }

}
