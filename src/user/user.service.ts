import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { catchError } from 'src/lib/exception';
import { successRes } from 'src/lib/success';
import { generateOtp } from 'src/utils/otp-generator/otp-generator';
import { MailService } from 'src/utils/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SignInUserDto } from './dto/signin-dto';
import { TokenService } from 'src/utils/token/generateToken';
import { writeToCookie } from 'src/utils/cookie/cookie';
import { ConfirmOtpDto } from './dto/confirmOtp-dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum';

export interface Payload {
  id: number;
  role: Role;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly tokenService: TokenService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto): Promise<object> {
    try {
      const existsEmail = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (existsEmail) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      const hashed_pass = await bcrypt.hash(createUserDto.password, 10);

      const newUser = {
        ...createUserDto,
        password: hashed_pass,
      };

      this.userRepo.create(createUserDto);
      await this.userRepo.save(newUser);

      const otp = generateOtp();
      await this.mailService.sendOtp(
        createUserDto.email,
        'Welcome to online marketplace',
        otp,
      );
      await this.cacheManager.set(createUserDto.email, otp, 120000);
      return successRes(
        {},
        200,
        `Otp sent to the email ${createUserDto.email}`,
      );
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto): Promise<object> {
    try {
      const { email, otp } = confirmOtpDto;
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user)
        throw new BadRequestException(
          `User with email ${email} does not exist`,
        );

      const hasUser = await this.cacheManager.get(email);

      if (!hasUser || hasUser !== otp)
        throw new BadRequestException(`Incorrect or expired otp`);

      return successRes(`Otp confirmed successfully`);
    } catch (e) {
      return catchError(e);
    }
  }

  async signIn(userSignInDto: SignInUserDto, res: Response): Promise<object> {
    try {
      const { email, password } = userSignInDto;

      const user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        throw new BadRequestException('Email or password incorrect');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new BadRequestException('Email or password incorrect');
      }

      const { id, role } = user;
      const payload: Payload = { id, role };

      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshTokenUser', refreshToken);

      return successRes(accessToken);
    } catch (error) {
      return catchError(error);
    }
  }

  async authUserProfile(req: Request): Promise<any> {
    try {
      if (req.user && 'id' in req.user) {
        const id = req.user.id as number;
        const user = await this.userRepo.findOne({ where: { id } });

        if (!user) {
          throw new NotFoundException(`User not found`);
        }

        const authUser = {
          full_name: user.full_name,
          email: user.email,
        };

        return successRes(authUser);
      }
    } catch (error) {
      return catchError(error);
    }
  }
}
