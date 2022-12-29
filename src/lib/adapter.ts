import type { Adapter } from '@auth/core/adapters'

export default function D1Adapter(d1: D1Database, options = {}): Adapter {
  return {
    async createUser({ email, emailVerified, image, name }) {
      console.log('createUser()')
      try {
        let result = await d1
          .prepare(
            'insert into user (email, emailVerified, image, name) values (?1, ?2, ?3, ?4) returning *;'
          )
          .bind(email, emailVerified?.toISOString(), image, name)
          .first()
        console.log('created user', result)
        return result
      } catch (e: any) {
        console.log({
          message: e.message,
          cause: e.cause.message
        })
      }
      return
    },
    async getUser(id) {
      console.log('getUser()')
      return await d1
        .prepare('select * from user where id = ?;')
        .bind(id)
        .first()
    },
    async getUserByEmail(email) {
      console.log('getUserByEmail()')
      return await d1
        .prepare('select * from user where email = ?;')
        .bind(email)
        .first()
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log('getUserByAccount()')
      try {
        const result = await d1
          .prepare(
            'select userId from account where providerAccountId = ?1 and provider = ?2;'
          )
          .bind(providerAccountId, provider)
          .first()
        if (result.userId) {
          return await d1
            .prepare('select * from user where id = ?1')
            .bind(result.userId)
            .first()
        } else {
          return null
        }
      } catch (e: any) {
        console.log(e)
      }
      return
    },
    async updateUser(user) {
      console.log('updateUser()')
      return
    },
    async deleteUser(userId) {
      console.log('deleteUser()')
      return
    },
    async linkAccount(account) {
      console.log('linkAccount()', account)
      try {
        let result = await d1
          .prepare(
            'insert into account (provider, providerAccountId, type, userId, access_token, expires_at, id_token, refresh_token, scope, token_type) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10) returning *;'
          )
          .bind(
            account.provider,
            account.providerAccountId,
            account.type,
            account.userId,
            account.access_token,
            account.expires_in,
            account.id_token,
            account.refresh_token,
            account.scope,
            account.token_type
          )
          .first()
        console.log('created account', result)
        return result
      } catch (e: any) {
        console.error(e)
      }
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log('createSession()')
      try {
        let result = await d1
          .prepare(
            'insert into session (sessionToken, userId, expires) values (?1, ?2, ?3) returning *;'
          )
          .bind(sessionToken, userId, expires.toISOString())
          .first()
        console.log('created session', result)
        return { ...result, expires: new Date(result.expires) }
      } catch (e: any) {
        console.log(e)
      }
      return
    },
    async getSessionAndUser(sessionToken) {
      console.log('getSessionAndUser()')
      try {
        let session = await d1
          .prepare('select * from session where sessionToken = ?;')
          .bind(sessionToken)
          .first()
        if (!session) return null
        let user = await d1
          .prepare('select * from user where id = ?')
          .bind(session.userId)
          .first()
        if (!user) return null
        return {
          user,
          session: { ...session, expires: new Date(session.expires) }
        }
      } catch (e: any) {
        console.log(e)
      }
      return
    },
    async updateSession({ sessionToken, expires, userId }) {
      console.log('updateSession()')
      return
    },
    async deleteSession(sessionToken) {
      console.log('deleteSession()')
      try {
        return d1
          .prepare('delete from session where sessionToken = ? returning *;')
          .bind(sessionToken)
          .first()
      } catch (e) {
        console.log(e)
        return
      }
    }
  }
}
