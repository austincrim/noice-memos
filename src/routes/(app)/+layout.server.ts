import { validateSession } from '$lib/session'
import type { RequestEvent } from './$types'

export async function load(event: RequestEvent) {
  let session = await validateSession(event)
  return { session }
}
