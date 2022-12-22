import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
  let session = await event.locals.getSession()
  if (!session || new Date(session.expires).valueOf() < new Date().valueOf()) {
    throw redirect(307, '/login')
  }
  return { session }
}
