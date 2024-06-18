import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { NewPcModule } from './pcuser/pc.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [NewPcModule, PrismaModule, AuthModule, EmailModule, SeederModule],
})
export class AppModule {}
