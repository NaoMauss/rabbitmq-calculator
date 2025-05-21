import type { CalculationResult } from '../utils/types'
import amqp from 'amqplib'
import { RABBITMQ_URL } from '../config/env'

const RESULT_QUEUE = 'calc_results'

async function startReceiver() {
  const conn = await amqp.connect(RABBITMQ_URL)
  const channel = await conn.createChannel()
  await channel.assertQueue(RESULT_QUEUE, { durable: true })
  console.log(`[x] Waiting for calculation results in ${RESULT_QUEUE}...`)

  channel.consume(RESULT_QUEUE, (msg) => {
    if (!msg)
      return
    const result: CalculationResult = JSON.parse(msg.content.toString())
    console.log(`[RESULT] ${result.n1} ${result.op} ${result.n2} = ${result.result}`)
    channel.ack(msg)
  }, { noAck: false })
}

startReceiver()
