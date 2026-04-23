import { IsEmail, IsString } from 'class-validator';

export class CredentialsDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
