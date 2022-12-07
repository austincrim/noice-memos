/** @type {import('./$types').PageServerLoad} */
export async function load({ platform }) {
  let memos = await platform.env.memos_bucket.list()
  // throw error(404, 'Not found')

  return { memos }
}
