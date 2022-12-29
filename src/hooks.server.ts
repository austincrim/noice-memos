import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import D1Adapter from '$lib/adapter'
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  let authHandle = SvelteKitAuth({
    providers: [
      GitHub({ clientId: GH_CLIENT_ID, clientSecret: GH_CLIENT_SECRET })
    ],
    adapter: D1Adapter(event.platform.env.DB),
    trustHost: true
  })
  let response = authHandle({ event, resolve })
  if (typeof response === 'object' && typeof response.then === 'function') {
    console.log(JSON.stringify(await response, null, 2))
  } else {
    console.log(await response.text())
  }
  return response
}
