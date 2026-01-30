import { IsEmail } from 'class-validator';

import { IsPassword } from '@common/decorators';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
