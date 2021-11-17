export const onRequestGet = async ({ request, env }) => {
  const ip = request.headers.get('cf-connecting-ip')
  try {
    const ipMemos = await env.memos.get(ip)
    return new Response(ipMemos)
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify(e))
  }
}

export async function onRequestPut({ request, env }) {
  const ip = request.headers.get('cf-connecting-ip')
  const newMemos = await request.json()

  try {
    await env.memos.put(ip, JSON.stringify(newMemos))
  } catch (e) {
    console.error(e)
  }

  return new Response(JSON.stringify(newMemos), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
