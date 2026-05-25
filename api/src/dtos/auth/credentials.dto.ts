import { Credentials } from '@open-elo/shared';
import { IsString } from 'class-validator';

export class CredentialsDTO implements Credentials {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
