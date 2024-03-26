import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { statusTable } from 'src/enums/status.table.enum';


export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
    @Prop({ default: statusTable.LOAD, required: true })
    status: statusTable
    @Prop()
    name: string
}

export const tableSchema = SchemaFactory.createForClass(Table);