import { IsString, IsEmail, IsInt } from 'class-validator';

export class AuthDto {
  @IsInt()
  id: number;
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  role: string;

  @IsString()
  password: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  phonenumber: string;

  @IsString()
  status: string;
}

export class ResetEmailDto {
  @IsEmail()
  @IsString()
  email: string;
}
