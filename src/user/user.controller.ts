import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmOtpDto } from './dto/confirmOtp-dto';
import { SignInUserDto } from './dto/signin-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from 'src/guard/authGuard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@UseInterceptors(CacheInterceptor)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user and send OTP' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'OTP sent to email',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP sent to your email successfully',
        data: null,
      },
    },
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUpUser(createUserDto);
  }

  @Post('confirm-otp')
  @ApiOperation({ summary: 'Confirm user OTP' })
  @ApiBody({ type: ConfirmOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP confirmed successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP confirmed successfully',
        data: {
          accessToken: 'JWT_TOKEN',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP',
  })
  async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
    return this.userService.confirmOtp(confirmOtpDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user and set refresh token cookie' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({
    status: 200,
    description: 'Access token returned',
    schema: {
      example: {
        statusCode: 200,
        message: 'Signed in successfully',
        data: {
          accessToken: 'JWT_TOKEN',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
  @ApiResponse({
    status: 200,
    description: 'User profile returned',
    schema: {
      example: {
        statusCode: 200,
        message: 'User profile fetched successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: '2025-08-23T14:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request) {
    return this.userService.authUserProfile(req);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to update',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'User updated successfully',
        data: {
          id: 1,
          name: 'Updated Name',
          email: 'updated@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'User deleted successfully',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 1 not found',
        error: 'Not Found',
      },
    },
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Post('upload-profile-image')
  @ApiOperation({ summary: 'Upload one profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Upload one profile image',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'File uploaded successfully',
        data: {
          file: {
            id: 1,
            path: 'http://localhost:3000/uploads/image_12345.jpg',
            createdAt: '2025-08-23T14:55:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  async uploadProfileImage(@UploadedFile() file?: Express.Multer.File) {
    return this.userService.uploadImage(file);
  }

  @Delete('delete-image/:id')
  @ApiOperation({ summary: 'Delete image by file ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the file to delete',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Image deleted successfully',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'File with ID 1 not found',
        error: 'Not Found',
      },
    },
  })
  async deleteImage(@Param('id', ParseIntPipe) fileId: number) {
    return this.userService.deleteImageById(fileId);
  }
}
