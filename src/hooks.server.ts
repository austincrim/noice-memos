import Auth from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private'

export const handle = Auth({
  providers: [
    GitHub({ clientId: GH_CLIENT_ID, clientSecret: GH_CLIENT_SECRET })
  ],
  trustHost: true
})
