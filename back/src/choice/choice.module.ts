import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceController } from './choice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './choice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Choice])
  ],
  providers: [ChoiceService],
  controllers: [ChoiceController]
})
export class ChoiceModule {}
