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

export async function onRequestGet({ request }) {
  const ip = request.headers.get('cf-connecting-ip')
  const ipMemos = await memos.get(ip)
  return new Response(ipMemos, {
    headers: CORS_HEADERS
  })
}

export async function onRequestPut({ request }) {
  const ip = request.headers.get('cf-connecting-ip')
  const newMemos = await request.json()

  await memos.put(ip, JSON.stringify(newMemos))

  return new Response(JSON.stringify(newMemos), {
    headers: CORS_HEADERS
  })
}
