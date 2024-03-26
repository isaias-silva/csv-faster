import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';


import { IcsvEnterUnit } from 'src/interfaces/csv.enter.interface';

import { Readable } from 'stream';
import { RabbitMqService } from '../queue/queue.service';

import { TableService } from '../table/table.service';

@Injectable()
export class DataManagerService {


    constructor(
        private readonly tableService: TableService,
        private readonly rabbitMqService: RabbitMqService) {

    }


    public async uploadCSVDataInDb(file: Buffer, name: string) {

        const readStream = Readable.from(file);
        const tableData = await this.tableService.generateNewTable(name)
        const { id, status } = tableData

        this.processData(readStream, id)

        return { message: "arquivo está sendo processado", id, status }
    }

    private async processData(stream: Readable, id: string) {

        const queue = await this.rabbitMqService.generateQueue(id, "store", true)

        stream.pipe(csvParser()).on('data', (row: IcsvEnterUnit) => {
            row.table_id = id
            this.rabbitMqService.sendToQueue(queue, JSON.stringify(row))
        }).on("close", () => {
            this.tableService.completeTable(id)
        })


    }

}
