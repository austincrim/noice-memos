import { error } from '@sveltejs/kit'
import z from 'zod'
import { validateSession } from '$lib/session'
import type { RequestEvent } from '../$types'

const postSchema = z.object({
  title: z.string(),
  src: z.string()
})

export async function POST(event: RequestEvent) {
  let session = await validateSession(event)
  const raw = await event.request.json()
  const body = postSchema.safeParse(raw)
  if (!body.success) {
    throw error(400, 'must pass required params')
  }
  let result = await event.platform?.env.memos_bucket.put(
    `${session.id}:${body.data.title}`,
    JSON.stringify(body.data)
  )

  return new Response(null, { status: 201 })
}
