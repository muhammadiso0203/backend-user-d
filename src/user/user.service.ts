import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { catchError } from 'src/lib/exception';
import { successRes } from 'src/lib/success';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existsUserUsername = await this.userRepo.findOne({
        where: { username: createUserDto.username },
      });

      if (existsUserUsername) {
        throw new ConflictException(
          `User with username ${createUserDto.username} already exists`,
        );
      }

      const existsUserEmail = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (existsUserEmail) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      const existsUserPhone = await this.userRepo.findOne({
        where: { phone_number: createUserDto.phone_number },
      });

      if (existsUserPhone) {
        throw new ConflictException(
          `User with phone ${createUserDto.phone_number} already exists`,
        );
      }

      const newUser = this.userRepo.create(createUserDto);
      await this.userRepo.save(newUser);

      return successRes(newUser, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find({ order: { createdAt: 'asc' } });
      return successRes(users);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const existsUser = await this.userRepo.findOne({ where: { id } });

      if (!existsUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return successRes(existsUser);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.username != null) {
        const existsUserUsername = await this.userRepo.findOne({
          where: { username: updateUserDto.username },
        });

        if (existsUserUsername && existsUserUsername.id !== id) {
          throw new ConflictException(
            `User with username ${updateUserDto.username} already exists`,
          );
        }
      }

      if (updateUserDto.email != null) {
        const existsUserEmail = await this.userRepo.findOne({
          where: { email: updateUserDto.email },
        });

        if (existsUserEmail && existsUserEmail.id !== id) {
          throw new ConflictException(
            `User with email ${updateUserDto.email} already exists`,
          );
        }
      }

      if (updateUserDto.phone_number != null) {
        const existsUserPhone = await this.userRepo.findOne({
          where: { phone_number: updateUserDto.phone_number },
        });

        if (existsUserPhone && existsUserPhone.id !== id) {
          throw new ConflictException(
            `User with phone ${updateUserDto.phone_number} already exists`,
          );
        }
      }

      const existsUser = await this.userRepo.findOne({ where: { id } });

      if (!existsUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const { affected } = await this.userRepo.update(id, updateUserDto);

      if (!affected) {
        throw new BadRequestException(`User with ID ${id} not updated`);
      }

      const updatedUser = await this.userRepo.findOne({ where: { id } });
      return successRes(updatedUser);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const existsUser = await this.userRepo.findOne({ where: { id } });

      if (!existsUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.userRepo.delete(id);
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
