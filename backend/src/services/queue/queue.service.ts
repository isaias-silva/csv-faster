import { Injectable } from '@nestjs/common';

import { config } from "dotenv"
import * as amqp from 'amqplib'
import { Logger } from "@nestjs/common"
import { RegisterService } from '../register/register.service';


config()


@Injectable()
export class RabbitMqService {
    private channel: amqp.Channel
    private logger = new Logger(RabbitMqService.name)

    private connect_error_count = 0;
    constructor(private readonly registerService:RegisterService) {
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

 

    private async consumerQueue(queueName: string) {
        try {

            await this.channel.consume(queueName, (message) => {

                this.logger.debug(`new message in queue "${queueName}" `)

                this.registerService.saveRegisterByPayload(message.content.toString())
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