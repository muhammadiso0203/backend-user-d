import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enum';
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
  @Column({ type: 'varchar', name: 'full_name' })
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @ApiProperty({
    example: 'PasswordHere',
    description: 'Password of the user',
  })
  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @ApiProperty({
    example: '2025-08-15T12:34:56.789Z',
    description: 'User creation timestamp',
  })
  @Column({
    type: 'enum',
    name: 'role',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    example: '2025-08-15T14:00:00.000Z',
    description: 'User create timestamp',
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
