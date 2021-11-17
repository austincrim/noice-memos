// const CORS_HEADERS = {
//   'access-control-allow-origin': 'https://noice-memos.pages.dev',
//   'access-control-allow-origin': 'http://localhost:3000',
//   'access-control-allow-headers': 'content-type',
//   'access-control-allow-methods': '*'
// }

// export const onRequestOptions = ({ request }) => {
//   if (request.method === 'OPTIONS') {
//     return new Response(null, {
//       headers: CORS_HEADERS
//     })
//   }
// }

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
