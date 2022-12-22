/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  let { session } = await event.parent()
  // let memos = await event.platform.env.memos_bucket.list()
  // throw error(404, 'Not found')

  return {}
}
