import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { successRes } from 'src/lib/success';
import { catchError } from 'rxjs';
import { FileService } from 'src/utils/file/file.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private fileService: FileService,
  ) {}

  async findAllImages() {
    try {
      const images = await this.fileRepo.find();
      return images
    } catch (error) {
      return catchError(error);
    }
  }

  async uploadImage(file?: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const uploadedPath = await this.fileService.createFile(file);

      if (!uploadedPath) {
        throw new InternalServerErrorException('File upload failed');
      }

      const fileEntity = this.fileRepo.create({ path: uploadedPath });
      const savedFile = await this.fileRepo.save(fileEntity);

      return successRes(savedFile, 200, 'File uploaded and saved successfully');
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteImageById(fileId: number) {
    try {
      const file = await this.fileRepo.findOne({ where: { id: fileId } });
      if (!file) throw new NotFoundException('File not found');

      await this.fileService.deleteFile(file.path);

      await this.fileRepo.delete(fileId);

      return successRes({}, 200, 'Image deleted successfully');
    } catch (error) {
      return catchError(error);
    }
  }
}
