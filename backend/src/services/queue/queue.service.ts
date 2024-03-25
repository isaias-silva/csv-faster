import { Injectable } from '@nestjs/common';

import { config } from "dotenv"
import * as amqp from 'amqplib'
import { Logger } from "@nestjs/common"
import { Register } from 'src/models/register.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { statusRegister } from 'src/enums/status.register.enum';
import { IcsvEnterUnit } from 'src/interfaces/csv.enter.interface';


config()


@Injectable()
export class RabbitMqService {
    private channel: amqp.Channel
    private logger = new Logger(RabbitMqService.name)

    private connect_error_count = 0;
    constructor(@InjectModel(Register.name) private readonly registerModel: Model<Register>,) {
        this.connect()
    }

    async connect() {

        const url = `amqp://${process.env.USER_MQ}:${process.env.PASS_MQ}@localhost:5673`

        try {
            const connection = await amqp.connect(url)
            this.channel = await connection.createChannel()
            this.logger.log("connected in RabbitMq")

        } catch (err) {
            if (this.connect_error_count >= 4) {
                throw err

            } else {
                this.connect_error_count += 1
                this.logger.error(`erro in connect to RabbitMq: ${err} \n reconnecting...`)
                setTimeout(() => {

                    this.connect()
                }, 5000)

            }




        }
    }
    async generateQueue(queueName: string, type: string, consumer: boolean): Promise<string> {


        try {

            const queue = await this.channel.assertQueue(`${type}_` + queueName)

            if (consumer) {
                this.consumerQueue(queue.queue)
            }

            return queue.queue

        } catch (err) {
            this.logger.error(`erro in create queue to RabbitMq: ${err}`)
        }
    }

    private async saveRegister(string: string) {


        const object: IcsvEnterUnit = JSON.parse(string)

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

                next_cycle: new Date(object['próximo ciclo']),
               
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
                default:
                    throw 'invalid status in csv'
            }
            
            return await this.registerModel.create(objectCreate)

        } catch (err) {
            console.log("erro em :" + object['próximo ciclo'] )
            throw err
        }
    }

    private async consumerQueue(queueName: string) {
        try {

            await this.channel.consume(queueName, (message) => {

                this.logger.debug(`new message in queue "${queueName}" `)

                this.saveRegister(message.content.toString())
                    .then((data) => this.logger.verbose(`${data.subscriber_id} save in db`))
                    .catch(err => this.logger.error(err))

                this.channel.ack(message)
            })
        }
        catch (err) {
            this.logger.error(`erro in observe queue '${queueName}' RabbitMq: ${err}`)
        }
    }
    async sendToQueue(queueName: string, payload: string) {
        try {
            this.channel.sendToQueue(queueName, Buffer.from(payload))
        }
        catch (err) {
            this.logger.error(`erro in send to queue '${queueName}' : ${err}`)
        }
    }
}