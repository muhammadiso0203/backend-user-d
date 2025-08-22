import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmOtpDto } from './dto/confirmOtp-dto';
import { SignInUserDto } from './dto/signin-dto';
import { Request, Response } from 'express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from 'src/guard/authGuard';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@UseInterceptors(CacheInterceptor)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user and send OTP' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'OTP sent to email' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUpUser(createUserDto);
  }

  @Post('confirm-otp')
  @ApiOperation({ summary: 'Confirm user OTP' })
  @ApiBody({ type: ConfirmOtpDto })
  @ApiResponse({ status: 200, description: 'OTP confirmed successfully' })
  async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
    return this.userService.confirmOtp(confirmOtpDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user and set refresh token cookie' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({ status: 200, description: 'Access token returned' })
  async signIn(
    @Body() userSignInDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signIn(userSignInDto, res);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'User profile returned' })
  async getProfile(@Req() req: Request) {
    return this.userService.authUserProfile(req);
  }
}
