import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from 'src/models/table.model';
import { RegisterService } from '../register/register.service';
import { statusTable } from 'src/enums/status.table.enum';

@Injectable()
export class TableService {

    constructor(
        @InjectModel(Table.name) private readonly tableModel: Model<Table>,
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
                status: 1

            }
        }]).exec()

        return tables
    }
    async getTable(_id: string) {

        const [table, registers] = await Promise.all([this.tableModel.findOne({ _id }), this.registerService.getRegisterOfTable(_id)])
        if (!table) {
            throw new NotFoundException('table not found')
        }
        
        const { name, id, status } = table
        const count = registers.length
        return { name, id, count, status }
    }

    async getMMRofTable(_id: string, month: number, year: number) {
        const table = await this.tableModel.findOne({ _id })

        if (!table) {
            throw new NotFoundException('table not found')
        }
        const registersMonth = await this.registerService.getMMRforRegisterPerMonth(_id, month, year)
        let totalMRR = 0;
        for (const register of registersMonth) {
            totalMRR += register.value;
        }
        return { registersMonth, totalMRR }
    }
    async getChurnRateOfTable(_id: string, month: number, year: number) {
        const table = await this.tableModel.findOne({ _id })

        if (!table) {
            throw new NotFoundException('table not found')
        }
        const { registers, calceledRegisters } = await this.registerService.getChurnRateForRegisterPerMonth(_id, month, year)
        const churnRate = (calceledRegisters.length / registers.length) * 100
        return { churnRate, registers }
    }

    async deleteTable(_id: string) {
        const table = await this.tableModel.findOne({ _id })
        if (!table) {
            throw new NotFoundException('table not found')
        }

        Promise.all([this.registerService.clearRegisterOfTable(_id), this.tableModel.deleteOne({ _id })])
        return { message: "table deleted" }
    }

    async completeTable(_id: string) {
        const table = await this.tableModel.findOne({ _id })
        if (table) {
            table.status = statusTable.COMPLETE
            await table.save()
        }
    }

}

