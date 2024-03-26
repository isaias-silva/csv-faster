import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TableService } from 'src/services/table/table.service';

@Controller('table')
@ApiTags('table info and generate charts')
export class TableController {
    constructor(private readonly tableService: TableService) { }

    @Get()
    @ApiOperation({description: "get all tables." })

    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'all tables', })
    async getTables() {

        return await this.tableService.getTables()
    }

    @Get('/:id')
    @ApiOperation({description: "searches a table and its records using id." })

    
    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'table info', })
    async getTable(@Param('id') id: string) {

        return await this.tableService.getTable(id)
    }

    @Delete('delete/:id')
    @ApiOperation({description: "delete a table and your register's." })

    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'table deleted', })

    async deleteTable(@Param('id') id: string) {

        return await this.tableService.deleteTable(id)
    }

}
