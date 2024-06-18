import { Module } from '@nestjs/common';
import { ShortcodeEmailService } from './email.service';
import { PasswordResetController } from './email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ShortcodeEmailService, ConfigService],
  controllers: [PasswordResetController],
})
export class EmailModule {}
