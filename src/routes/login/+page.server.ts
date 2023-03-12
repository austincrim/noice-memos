import { redirect } from '@sveltejs/kit'

export async function load(event) {
  let session = await event.locals.getSession()
  if (session && new Date(session.expires).valueOf() > new Date().valueOf()) {
    throw redirect(307, '/')
  }
}
