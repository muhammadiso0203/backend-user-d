import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TokenService } from 'src/utils/token/generateToken';
import { FileEntity } from './entities/file.entity';
import { FileModule } from 'src/utils/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity]), FileModule],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
