import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all uploaded images' })
  @ApiResponse({
    status: 200,
    description: 'List of all images',
    schema: {
      example: {
        statusCode: 200,
        message: 'Request successful',
        data: [
          {
            id: 1,
            path: 'http://localhost:3000/uploads/image1.jpg',
            createdAt: '2025-08-25T10:00:00.000Z',
          },
          {
            id: 2,
            path: 'http://localhost:3000/uploads/image2.jpg',
            createdAt: '2025-08-25T10:05:00.000Z',
          },
        ],
      },
    },
  })
  async findAllImages() {
    return this.imagesService.findAllImages();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Upload image file',
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
    description: 'Image uploaded successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'File uploaded and saved successfully',
        data: {
          id: 3,
          path: 'http://localhost:3000/uploads/image3.jpg',
          createdAt: '2025-08-25T10:10:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No file uploaded',
  })
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    return this.imagesService.uploadImage(file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the image to delete',
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
    description: 'Image not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'File not found',
        error: 'Not Found',
      },
    },
  })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.deleteImageById(id);
  }
}
