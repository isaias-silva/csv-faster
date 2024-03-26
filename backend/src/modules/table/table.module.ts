import { Module } from '@nestjs/common';
import { TableController } from 'src/controllers/table/table.controller';
import { TableService } from 'src/services/table/table.service';

import { MongooseModule } from '@nestjs/mongoose';

import { Table, tableSchema } from 'src/models/table.model';
import { RegisterService } from 'src/services/register/register.service';
import { Register, registerSchema } from 'src/models/register.model';


@Module({
imports:[
    MongooseModule.forFeature([
        { name: Table.name, schema: tableSchema },
        { name: Register.name, schema: registerSchema }])

],
    providers:[TableService,RegisterService],
    controllers:[TableController],
    exports:[TableService,RegisterService,MongooseModule]
})
export class TableModule {}
