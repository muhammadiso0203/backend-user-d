import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import config from './config';
import { UserEntity } from './user/entities/user.entity';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ImagesModule } from './images/images.module';
import { FileEntity } from './images/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      autoLoadEntities: true,
      entities: [UserEntity, FileEntity],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    UserModule,
    ImagesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
