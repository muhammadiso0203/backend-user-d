import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailModule } from 'src/utils/mail/mail.module';
import { TokenService } from 'src/utils/token/generateToken';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MailModule],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
