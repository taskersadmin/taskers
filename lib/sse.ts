import { redis } from './redis'

export async function publishJobUpdate(jobId: string, data: any) {
  await redis.publish(`job:${jobId}`, JSON.stringify(data))
}

export async function subscribeToJob(jobId: string, callback: (data: any) => void) {
  const subscriber = redis.duplicate()
  await subscriber.subscribe(`job:${jobId}`)
  subscriber.on('message', (channel, message) => {
    callback(JSON.parse(message))
  })
  return subscriber
}
