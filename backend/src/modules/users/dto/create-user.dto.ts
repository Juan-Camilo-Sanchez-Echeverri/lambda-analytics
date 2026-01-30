import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsPassword } from '@common/decorators';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
