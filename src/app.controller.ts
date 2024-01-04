import { Controller, Get } from '@nestjs/common';

@Controller()
export class MessageController {
  @Get()
  message() {
        return `Online`;
  }
}
