import { Module } from '@nestjs/common';

import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { envs } from '@configs';

import { UsersModule } from '@modules/users/users.module';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: {
            expiresIn: envs.jwtExpiration as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
