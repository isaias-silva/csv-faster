import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadController } from 'src/controllers/upload/upload.controller';
import { Register, registerSchema } from 'src/models/register.model';
import { Table, tableSchema } from 'src/models/table.model';
import { DataManagerService } from 'src/services/data-manager/data-manager.service';
import { RabbitMqService } from 'src/services/queue/queue.service';
import { RegisterService } from 'src/services/register/register.service';
import { TableService } from 'src/services/table/table.service';
import { TableModule } from '../table/table.module';


@Module({

    imports: [
        TableModule],

    providers: [DataManagerService,
        RabbitMqService,
        RegisterService,
        TableService
    ],
    controllers: [UploadController],
    exports: [DataManagerService]
})
export class UploadModule { }
