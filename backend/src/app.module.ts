import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config()

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.USER_DB}:${process.env.PASS_DB}@localhost:27017`),
    MulterModule.register({
      dest: '/upload',
    }), UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule { }