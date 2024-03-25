import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from 'src/models/table.model';
import { RegisterService } from '../register/register.service';

@Injectable()
export class TableService {
    constructor(@InjectModel(Table.name) private readonly tableModel: Model<Table>,
        private readonly registerService: RegisterService) { }

    async generateNewTable(nameTable: string) {

        const count = await this.tableModel.countDocuments({ nameTable })
        let name = count > 0 ? nameTable + count : nameTable

        return await this.tableModel.create({ name })
    }

    async getTables() {

        const tables = await this.tableModel.aggregate([{
            $project: {
                _id: 1,
                name: 1,

            }
        }]).exec()

        return tables
    }
    async getTable(_id: string) {
        const table = await this.tableModel.findOne({ _id })
        if (!table) {
            throw new NotFoundException('table not found')
        }
        return table
    }

    async deleteTable(_id: string) {
        const table = await this.tableModel.findOne({ _id })
        if (!table) {
            throw new NotFoundException('table not found')
        }
        await this.tableModel.deleteOne({_id})
        return {message:"table deleted"}
    }

}

