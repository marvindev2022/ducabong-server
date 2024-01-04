import { NotFoundException} from "@nestjs/common";

export class MissingParamError extends NotFoundException {
  constructor(param: string) {
    super(`${param} is missing`, { cause: Error() });
    this.name = 'MissingParamError';
  }
}