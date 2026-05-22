import { RegistrationData } from '@open-elo/shared';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDTO implements RegistrationData{
  @IsEmail()
  email!: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password!: string;

  @IsString()
  username!: string;
}
