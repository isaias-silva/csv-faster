import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { statusRegister } from 'src/enums/status.register.enum';
import { IcsvEnterUnit } from 'src/interfaces/csv.enter.interface';
import { Register } from 'src/models/register.model';
import dateConvert from 'src/utils/date.convert';

@Injectable()
export class RegisterService {
    constructor(@InjectModel(Register.name) private readonly registerModel: Model<Register>) { }

    private logger: Logger = new Logger(RegisterService.name)

    async saveRegisterByPayload(payload: string) {


        const object: IcsvEnterUnit = JSON.parse(payload)

        const { table_id } = object

        const exist = await this.registerModel.findOne({ table_id, subscriber_id: object['ID assinante'] })
        if (exist) {
            return
        }

        try {
            const objectCreate: Register = {

                amount_charges: parseInt(object['quantidade cobranças']),

                charge_per_day: parseInt(object['cobrada a cada X dias']),

                value: parseInt(object['valor']),

                status: statusRegister.ACTIVE,

                init_date: new Date(object['data início']),

                status_date: new Date(object['data status']),

                cancellation_date: object['data cancelamento'] ? new Date(object['data cancelamento']) : null,

                next_cycle: dateConvert(object['próximo ciclo']),

                subscriber_id: object['ID assinante'],

                table_id: table_id,

            }
            switch (object['status']) {

                case statusRegister.ACTIVE:
                    objectCreate.status = statusRegister.ACTIVE
                    break
                case statusRegister.CANCELLED:
                    objectCreate.status = statusRegister.CANCELLED
                    break
                case statusRegister.TRIAL_CANCELLED:
                    objectCreate.status = statusRegister.TRIAL_CANCELLED
                    break
                case statusRegister.UPGRADE:
                    objectCreate.status = statusRegister.UPGRADE
                    break
                case statusRegister.ATRASADA:
                    objectCreate.status = statusRegister.ATRASADA
                    break
                default:
                    throw 'invalid status in csv'
            }

            return await this.registerModel.create(objectCreate)

        } catch (err) {

            throw err
        }
    }

    async getRegisterOfTable(table_id: string) {

        return await this.registerModel.find({ table_id })
    }

    async clearRegisterOfTable(table_id: string) {

        this.logger.debug(`delete register for table ${table_id}`)
        await this.registerModel.deleteMany({ table_id })
    }
}
