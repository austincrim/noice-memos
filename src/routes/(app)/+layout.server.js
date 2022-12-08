import { redirect } from '@sveltejs/kit'
import { isValidSession } from '$lib/user'

/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
  if (!isValidSession(event.cookies)) {
    throw redirect(307, '/login')
  }
}
