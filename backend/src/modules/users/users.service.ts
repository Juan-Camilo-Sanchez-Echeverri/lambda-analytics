import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { bcryptAdapter } from '@common/adapters';

import { envs } from '@configs';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id')
      .limit(1)
      .getOne();

    if (!existingUser) {
      await this.create({
        name: envs.defaultUserName,
        email: envs.defaultUserEmail,
        password: envs.defaultUserPassword,
      });
    }
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const passwordHash = await bcryptAdapter.hash(password);

    const user = this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return this.userRepository.save(user);
  }
}
