import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import path
import { SeederService } from './seeder.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [PrismaService, SeederService, ConfigService],
  exports: [SeederService],
})
export class SeederModule {}
