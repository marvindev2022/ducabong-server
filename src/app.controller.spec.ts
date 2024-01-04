import { Test, TestingModule } from '@nestjs/testing';
import {MessageController} from './app.controller';

describe('AppController', () => {
  let appController: MessageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [],
    }).compile();

    appController = app.get<MessageController>(MessageController);
  });

  describe('root', () => {
    it('should return "Online!"', () => {
      expect(appController.message()).toBe('Online');
    });
  });
});
