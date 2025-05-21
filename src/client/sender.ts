import type { CalculationRequest, Operation } from '../utils/types'
import amqp from 'amqplib'
import { RABBITMQ_URL } from '../config/env'

const DIRECT_EXCHANGE = 'calc_direct'
const FANOUT_EXCHANGE = 'calc_fanout'
const OPERATIONS: Operation[] = ['add', 'sub', 'mul', 'div', 'all']

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomOperation(): Operation {
  return OPERATIONS[getRandomInt(0, OPERATIONS.length - 1)]
}

async function sendCalculationRequest() {
  const n1 = getRandomInt(1, 100)
  const n2 = getRandomInt(1, 100)
  const op = getRandomOperation()
  const request: CalculationRequest = { n1, n2, op }

  try {
    const conn = await amqp.connect(RABBITMQ_URL)
    const channel = await conn.createChannel()
    // Déclarer les exchanges
    await channel.assertExchange(DIRECT_EXCHANGE, 'direct', { durable: true })
    await channel.assertExchange(FANOUT_EXCHANGE, 'fanout', { durable: true })

    if (op === 'all') {
      // Fanout : publier dans l'exchange fanout (aucune routingKey requise)
      channel.publish(FANOUT_EXCHANGE, '', Buffer.from(JSON.stringify(request)), { persistent: true })
      console.log(`[x] Sent request to FANOUT exchange: ${JSON.stringify(request)}`)
    }
    else {
      // Direct : publier dans l'exchange direct avec la routingKey correspondant à l'opération
      channel.publish(DIRECT_EXCHANGE, op, Buffer.from(JSON.stringify(request)), { persistent: true })
      console.log(`[x] Sent request to DIRECT exchange (${op}): ${JSON.stringify(request)}`)
    }
    await channel.close()
    await conn.close()
  }
  catch (err) {
    console.error('Failed to send calculation request:', err)
  }
}

function startSending(intervalMs: number = 5000) {
  setInterval(sendCalculationRequest, intervalMs)
  // Send immediately on start
  sendCalculationRequest()
}

startSending()
