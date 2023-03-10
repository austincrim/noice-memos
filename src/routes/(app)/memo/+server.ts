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

  let newKey = `${session.id}:${crypto.randomUUID()}`

  await event.platform?.env.memos_bucket.put(newKey, JSON.stringify(body.data))

  return new Response(null, { status: 201 })
}
