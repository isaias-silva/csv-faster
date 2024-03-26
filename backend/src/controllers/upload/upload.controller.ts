import { Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataManagerService } from 'src/services/data-manager/data-manager.service';



@Controller('upload')
@ApiTags('upload of files')

export class UploadController {

    constructor(private readonly dataManagerService: DataManagerService) {

    }
    @Post('/csv')
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 400, description: 'file is required or file type is invalid' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 201, description: 'file uploaded', })
    @ApiOperation({ description: "upload a .csv file and generate a table" })

    @UseInterceptors(FileInterceptor('file'))
    uploadCsv(@UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({ fileType: 'text/csv' }),

        ]
    })) file: Express.Multer.File) {


        return this.dataManagerService.uploadCSVDataInDb(file.buffer, file.originalname)

    }
}
