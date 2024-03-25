import { Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { DataManagerService } from 'src/services/data-manager/data-manager.service';



@Controller('upload')
export class UploadController {

    constructor(private readonly dataManagerService: DataManagerService) {

    }
    @Post('/csv')
    @UseInterceptors(FileInterceptor('file'))

    uploadCsv(@UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({ fileType: 'text/csv' }),

        ]
    })) file: Express.Multer.File) {

       return this.dataManagerService.saveCSVDataInDb(file.buffer)

    }
}
