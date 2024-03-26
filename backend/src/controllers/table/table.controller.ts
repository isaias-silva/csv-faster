import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TableService } from 'src/services/table/table.service';

@Controller('table')
@ApiTags('table info and generate charts')
export class TableController {
    constructor(private readonly tableService: TableService) { }

    @Get()
    @ApiOperation({ description: "get all tables." })

    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'all tables', })
    async getTables() {

        return await this.tableService.getTables()
    }

    @Get('/:id')
    @ApiOperation({ description: "searches a table and its records using id." })


    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'table info', })
    async getTable(@Param('id') id: string) {

        return await this.tableService.getTable(id)
    }


    @Get('mmr/:id/:month/:year')
    @ApiOperation({ description: "return  Monthly Recurring Revenue (MRR) of table in specify month" })
    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: ' Monthly Recurring Revenue (MRR) info', })

    async getMMR(@Param('id') id: string, @Param('month') month: number, @Param('year') year: number) {

        return await this.tableService.getMMRofTable(id,month,year)
    }


    @Get('churnrate/:id/:month/:year')
    @ApiOperation({ description: "calculates the Churn Rate of a table, which is a metric that represents the rate of customer loss" })
    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: ' Monthly Recurring Revenue (MRR) info', })

    async getChurnRate(@Param('id') id: string, @Param('month') month: number, @Param('year') year: number) {

        return await this.tableService.getChurnRateOfTable(id,month,year)
    }


    @Delete('delete/:id')
    @ApiOperation({ description: "delete a table and your register's." })

    @ApiResponse({ status: 404, description: 'table not found.' })
    @ApiResponse({ status: 500, description: 'internal error.' })
    @ApiResponse({ status: 200, description: 'table deleted', })

    async deleteTable(@Param('id') id: string) {

        return await this.tableService.deleteTable(id)
    }

}
