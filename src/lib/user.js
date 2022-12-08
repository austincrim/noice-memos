/** @param {import('@sveltejs/kit').Cookies} cookies */
export function isValidSession(cookies) {
  let cookie = cookies.get('session_id')

  return Boolean(cookie)
}
