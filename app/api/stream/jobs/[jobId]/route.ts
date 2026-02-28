import { NextRequest } from 'next/server'
import { subscribeToJob } from '@/lib/sse'

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ status: 'connected', jobId: params.jobId })

      // Subscribe to Redis
      const subscriber = await subscribeToJob(params.jobId, (data) => {
        send(data)
      })

      // Keep alive
      const interval = setInterval(() => {
        send({ type: 'ping' })
      }, 30000)

      // Cleanup
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        subscriber.unsubscribe()
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
