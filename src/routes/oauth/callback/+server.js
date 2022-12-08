/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event) {
  let { code } = Object.fromEntries(
    new URL(event.request.url).searchParams.entries()
  )
  console.log(event.platform.env)
  let res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: event.platform.env.GH_CLIENT_ID,
      client_secret: event.platform.env.GH_CLIENT_SECRET,
      code
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  if (res.ok) {
    let tokenRes = await res.json()
  } else {
    console.log('token fetch failed')
    console.log(await res.json())
  }
  return new Response(null)
}
