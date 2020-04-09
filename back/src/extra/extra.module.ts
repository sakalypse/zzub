import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extra } from './extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extra])
  ],
  providers: [ExtraService],
  controllers: [ExtraController]
})
export class ExtraModule {}
