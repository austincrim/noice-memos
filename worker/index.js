addEventListener('fetch', event => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(
      new Response(null, {
        headers: {
          'access-control-allow-origin': event.request.headers.get('Origin'),
          'access-control-allow-headers': 'content-type',
        },
      }),
    )
  } else if (event.request.method === 'POST') {
    event.respondWith(handlePost(event.request))
  } else if (event.request.method === 'GET') {
    event.respondWith(handleGet(event.request))
  }
})
/**
 * @param {Request} request
 */
async function handleGet(request) {
  const ip = request.headers.get('cf-connecting-ip')
  const ipMemos = await memos.get(ip)
  return new Response(ipMemos, {
    headers: {
      'access-control-allow-origin': '*',
    },
  })
}

/**
 * @param {Request} request
 */
async function handlePost(request) {
  const ip = request.headers.get('cf-connecting-ip')
  const newMemo = await request.json()

  const existing = JSON.parse(await memos.get(ip))
  const newMemos = existing?.length > 0 ? [...existing, newMemo] : [newMemo]
  await memos.put(ip, JSON.stringify(newMemos))

  return new Response(JSON.stringify(newMemos), {
    status: 200,
    headers: { 'access-control-allow-origin': '*' },
  })
}
