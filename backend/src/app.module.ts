import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { DataManagerService } from './services/data-manager/data-manager.service';


@Module({
  imports: [
    MulterModule.register({
      dest: '/upload',
    }), UploadModule],
  controllers: [],
  providers: [DataManagerService],
})
export class AppModule { }
