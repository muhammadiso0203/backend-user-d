import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/image.entity';
import { FileService } from 'src/utils/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [ImagesController],
  providers: [ImagesService, FileService],
})
export class ImagesModule {}
