import { redirect, type RequestEvent } from '@sveltejs/kit'

export async function validateSession(event: RequestEvent) {
  let session = await event.locals.getSession()
  if (!session || new Date(session.expires).valueOf() < new Date().valueOf()) {
    throw redirect(307, '/login')
  }
  let id = event.cookies.get('next-auth.session-token')
  if (!id) {
    console.error('session cookie not set')
    id = ''
  }
  return { ...session, id }
}
