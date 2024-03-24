import { Module } from '@nestjs/common';
import { UploadController } from 'src/controllers/upload/upload.controller';
import { DataManagerService } from 'src/services/data-manager/data-manager.service';


@Module({

    providers: [DataManagerService],
    controllers: [UploadController],
    exports: []
})
export class UploadModule { }
