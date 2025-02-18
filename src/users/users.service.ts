import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

  async findOneBy(user: FindUserDto): Promise<User | undefined> {
    const entity = await this.repo.findOne(user);
    return entity;
  }

  async checkPassword(username: string, password: string): Promise<Boolean> {
    const user = await this.repo.createQueryBuilder("user").addSelect('user.passwordHash').where("user.username = :username", { username }).getOneOrFail();
    return user.checkPassword(password);
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneBy({ username: createUserDto.username });
    if (existingUser) throw new Error('User with given email already exists');
    const user = new User();
    user.username = createUserDto.username;
    user.name = createUserDto.name;
    await user.setPassword(createUserDto.password);
    const result = await this.repo.insert(user);
    const userId: string = result.generatedMaps[0].id;
    return this.findOneBy({ id: userId });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOneOrFail({ id });
    if (updateUserDto.username) {
      const existingUser = await this.findOneBy({ username: updateUserDto.username });
      if (existingUser) throw new Error('User with given email already exists');
      user.username = updateUserDto.username;
    }
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.password) await user.setPassword(updateUserDto.password);
    if (updateUserDto.name) user.name = updateUserDto.name;
    await this.repo.update({ id }, user);
    return this.findOneBy({ id });
  }
}
