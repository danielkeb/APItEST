import { Module } from '@nestjs/common';
import { NewPcController } from './pc.controller';
import { NewPcService } from './pc.service';
import { JwtModule } from '@nestjs/jwt';
//import { AccessContorlService } from 'src/auth/shared/access-control.service';

@Module({
  providers: [NewPcService],
  controllers: [NewPcController],
  imports: [
    JwtModule.register({}), // Configure JwtModule
  ],
})
export class NewPcModule {}
