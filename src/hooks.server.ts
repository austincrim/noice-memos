import type { Handle } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import D1Adapter from '$lib/adapter'
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private'

export const handle: Handle = ({ event, resolve }) => {
  let authHandle = SvelteKitAuth({
    providers: [
      GitHub({
        clientId: GH_CLIENT_ID,
        clientSecret: GH_CLIENT_SECRET,
        userinfo: {
          url: 'https://api.github.com/user',
          async request({ tokens }) {
            const profile = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'User-Agent': 'my-fun-worker'
              }
            }).then(async (res) => await res.json())
            return profile
          }
        }
      })
    ],
    adapter: D1Adapter(event.platform.env.__D1_BETA__DB),
    trustHost: true
  })
  console.log(event.platform.env)
  return authHandle({ event, resolve })
}
