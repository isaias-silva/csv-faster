import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { statusRegister } from 'src/enums/status.register.enum';

export type RegisterDocument = HydratedDocument<Register>;

@Schema()
export class Register {

    @Prop({ required: true })
    amount_charges: number
    @Prop({ required: true })
    charge_per_day: number
    @Prop({ required: true })
    value: number
    @Prop({ required: true })
    status: statusRegister
    @Prop({ required: true })
    init_date: Date
    @Prop({ required: true })
    status_date: Date
    @Prop()
    cancellation_date: Date
    @Prop()
    next_cycle: Date

    @Prop({ required: true })

    subscriber_id: string
    @Prop({ required: true })
    table_id: string
}

export const registerSchema = SchemaFactory.createForClass(Register);