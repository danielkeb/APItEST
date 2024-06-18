import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
//import { JwtStrategy } from './strategy';
import { AccessContorlService } from './shared/access-control.service'; // Import AccessContorlService
import { SharedModule } from './shared/shared.module';
import { ShortcodeEmailService } from '../email/email.service';

@Module({
  providers: [
    AuthService,
    ConfigService,
    //JwtStrategy,
    AccessContorlService,
    ShortcodeEmailService,
  ], // Provide AccessContorlService here
  controllers: [AuthController],
  imports: [JwtModule.register({}), SharedModule],
})
export class AuthModule {}
