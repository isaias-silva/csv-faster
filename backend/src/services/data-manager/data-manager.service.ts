import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as csvParser from 'csv-parser';


import * as fs from 'fs'
import { Model } from 'mongoose';
import { IcsvEnterUnit } from 'src/interfaces/csv.enter.interface';
import { Register } from 'src/models/register.model';
import { Table } from 'src/models/table.model';
import { Readable } from 'stream';
import { RabbitMqService } from '../queue/queue.service';
import { statusRegister } from 'src/enums/status.register.enum';

@Injectable()
export class DataManagerService {


    constructor(
        @InjectModel(Table.name) private readonly tableModel: Model<Table>,


        private readonly rabbitMqService: RabbitMqService) {


    }


    public async saveCSVDataInDb(file: Buffer) {


        const readStream = Readable.from(file);


        const tableData = await this.tableModel.create({})

        const { id, status } = tableData

        this.processData(readStream, id)

        return { message: "arquivo está sendo processado", id, status }
    }

    public async processData(stream: Readable, id: string) {

        const queue = await this.rabbitMqService.generateQueue(id, "store", true)

        stream.pipe(csvParser()).on('data', (row: IcsvEnterUnit) => {
            row.table_id = id
            this.rabbitMqService.sendToQueue(queue, JSON.stringify(row))
        }).on("close", () => {
            console.log('end read csv')
        })


    }

}
