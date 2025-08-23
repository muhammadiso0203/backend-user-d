import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('images')
export class FileEntity {
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the image file',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'http://localhost:3000/uploads/example_1234.jpg',
    description: 'Public URL (path) to access the uploaded image',
  })
  @Column({ type: 'varchar', name: 'path' })
  path: string;

  @ApiProperty({
    example: '2025-08-23T14:55:00.000Z',
    description: 'Timestamp when the image was uploaded',
  })
  @CreateDateColumn()
  createdAt: Date;
}
