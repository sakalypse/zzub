import { Test, TestingModule } from '@nestjs/testing';
import { ExtraController } from './extra.controller';

describe('Extra Controller', () => {
  let controller: ExtraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraController],
    }).compile();

    controller = module.get<ExtraController>(ExtraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
