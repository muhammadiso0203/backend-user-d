import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @ApiProperty({
    example: 1,
    description: 'Auto-generated unique user ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username for the user',
  })
  @Column({ type: 'varchar', name: 'username', unique: true })
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Uzbekistan phone number',
  })
  @Column({ type: 'varchar', name: 'phone_number', unique: true })
  phone_number: string;

  @ApiProperty({
    example: 'HashedPasswordHere',
    description: 'Hashed password of the user',
  })
  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @ApiProperty({
    example: 'MALE',
    description: 'Gender of the user',
    enum: Gender,
  })
  @Column({ type: 'varchar', name: 'gender', enum: Gender })
  gender: Gender;

  @ApiProperty({
    example: '2025-08-15T12:34:56.789Z',
    description: 'User creation timestamp',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-15T14:00:00.000Z',
    description: 'User last update timestamp',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
