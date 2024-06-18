import { IsString } from '@nestjs/class-validator';

export class PasswordDto {
  @IsString()
  password: string;
}
