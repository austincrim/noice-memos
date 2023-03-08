import { validateSession } from '$lib/session'
import { error } from '@sveltejs/kit'
import { fail } from '@sveltejs/kit'
import z from 'zod'
import type { Actions, PageServerLoad } from './$types'

const memosSchema = z.array(
  z.object({
    title: z.string(),
    src: z.string(),
    r2Key: z.string()
  })
)

export const load: PageServerLoad = async (event) => {
  event.depends('memos:load')

  let session = await validateSession(event)
  let result = await event.platform?.env.memos_bucket.list({
    prefix: session.id
  })
  // throw error(404, 'Not found')

  if (!result || result?.objects?.length === 0) {
    return { memos: [] }
  }

  let memos = await Promise.all(
    result.objects.map((o) =>
      event.platform?.env.memos_bucket.get(o.key).then((d) => {
        return new Promise((res) => {
          d?.json().then((j) => res({ ...j, r2Key: o.key }))
        })
      })
    )
  )

  let parsed = memosSchema.safeParse(memos)
  if (!parsed.success) {
    throw error(500, 'failed to fetch memos')
  }

  return { memos: parsed.data }
}

export const actions: Actions = {
  delete: async (event) => {
    await validateSession(event)
    let key = (await event.request.formData()).get('key')?.toString()
    if (!key) {
      return fail(400)
    }

    await event.platform?.env.memos_bucket.delete(key)
    return { success: true }
  }
}
