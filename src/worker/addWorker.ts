import type { CalculationRequest, CalculationResult } from '../utils/types'
import amqp from 'amqplib'
import { RABBITMQ_URL } from '../config/env'

const QUEUE = 'calc_add'
const RESULT_QUEUE = 'calc_results'

function getRandomDelay() {
  return Math.floor(Math.random() * 11000) + 5000 // 5-15s
}

function calculate(n1: number, n2: number): number {
  return n1 + n2
}

async function startWorker() {
  const conn = await amqp.connect(RABBITMQ_URL)
  const channel = await conn.createChannel()
  await channel.assertQueue(QUEUE, { durable: true })
  await channel.assertQueue(RESULT_QUEUE, { durable: true })
  await channel.assertExchange('calc_direct', 'direct', { durable: true })
  await channel.assertExchange('calc_fanout', 'fanout', { durable: true })
  await channel.bindQueue(QUEUE, 'calc_direct', 'add')
  await channel.bindQueue(QUEUE, 'calc_fanout', '')
  console.log(`[x] addWorker started, listening on ${QUEUE}`)

  channel.consume(QUEUE, async (msg) => {
    if (!msg)
      return
    const request: CalculationRequest = JSON.parse(msg.content.toString())
    console.log(`[>] Processing: ${JSON.stringify(request)}`)
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
    const result: CalculationResult = {
      ...request,
      op: 'add',
      result: calculate(request.n1, request.n2),
    }
    channel.sendToQueue(RESULT_QUEUE, Buffer.from(JSON.stringify(result)), { persistent: true })
    console.log(`[<] Result sent: ${JSON.stringify(result)}`)
    channel.ack(msg)
  }, { noAck: false })
}

startWorker()
