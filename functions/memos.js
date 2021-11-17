// const CORS_HEADERS = {
//   'access-control-allow-origin': 'https://noice-memos.pages.dev',
//   // 'access-control-allow-origin': 'http://localhost:5000',
//   'access-control-allow-headers': 'content-type',
//   'access-control-allow-methods': '*',
// }

// addEventListener('fetch', event => {
//   if (event.request.method === 'OPTIONS') {
//     event.respondWith(
//       new Response(null, {
//         headers: CORS_HEADERS,
//       }),
//     )
//   } else if (event.request.method === 'GET') {
//     event.respondWith(handleGet(event.request))
//   } else if (event.request.method === 'PUT') {
//     event.respondWith(handlePut(event.request))
//   }
// })

export const onRequestGet = async ({ request, env }) => {
  const ip = request.headers.get('cf-connecting-ip')
  const ipMemos = await env.memos.get(ip)
  return new Response(JSON.stringify(ipMemos), {
    headers: { 'content-type': 'application/json' }
  })
}

export async function onRequestPut({ request, env }) {
  const ip = request.headers.get('cf-connecting-ip')
  const newMemos = await request.json()

  await env.memos.put(ip, JSON.stringify(newMemos))

  return new Response(JSON.stringify(newMemos), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
