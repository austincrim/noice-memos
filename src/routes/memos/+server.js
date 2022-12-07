/** @type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ request, platform }) => {
  const ip = request.headers.get('cf-connecting-ip')
  if (!ip) {
    return new Response(JSON.stringify({ error: 'please provide id!' }), {
      status: 400
    })
  }
  try {
    const ipMemos = await platform.env.memos.get(ip)
    return new Response(ipMemos)
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify(e), { status: 500 })
  }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export const PUT = async ({ request, platform }) => {
  const ip = request.headers.get('cf-connecting-ip')
  if (!ip) {
    return new Response(JSON.stringify({ error: 'please provide id!' }), {
      status: 400
    })
  }
  const newMemos = await request.json()

  try {
    await platform.env.memos.put(ip, JSON.stringify(newMemos))
  } catch (e) {
    console.error(e)
  }

  return new Response(JSON.stringify(newMemos), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
