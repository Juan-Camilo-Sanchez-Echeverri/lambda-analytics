import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { bcryptAdapter } from '@common/adapters';

import { UsersService } from '@modules/users/users.service';

import { LoginDto } from './dto/login.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    const payload = { id: user.id, email: user.email };
    const accessToken = await this.getJwtToken(payload);

    return { accessToken };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isEqual = await bcryptAdapter.compare(password, user.password);

    if (!isEqual) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    return user;
  }

  private async getJwtToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
