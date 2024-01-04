import { BadRequestException } from '@nestjs/common';

export class InvalidParamError extends BadRequestException {
  constructor(param: string) {
    super(`${param} is invalid`, { cause: Error() });
    this.name = 'InvalidParamsError';
  }
}
