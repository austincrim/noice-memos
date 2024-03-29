import type { Handle } from '@sveltejs/kit'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import D1Adapter from '$lib/adapter'
import {
  GH_CLIENT_ID,
  GH_CLIENT_SECRET,
  AUTH_SECRET
} from '$env/static/private'

export const handle: Handle = ({ event, resolve }) => {
  let authHandle = SvelteKitAuth({
    providers: [
      GitHub({
        clientId: GH_CLIENT_ID,
        clientSecret: GH_CLIENT_SECRET
      })
    ],
    adapter: D1Adapter(event.platform?.env.DB),
    trustHost: true,
    secret: AUTH_SECRET
  })

  return authHandle({ event, resolve })
}
