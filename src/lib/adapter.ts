import type { Adapter } from '@auth/core/adapters'

export default function D1Adapter(d1: D1Database, options = {}): Adapter {
  return {
    async createUser({ email, emailVerified, image, name }) {
      let result = await d1
        .prepare(
          'insert into user (email, emailVerified, image, name) values (?1, ?2, ?3, ?4);'
        )
        .bind(email, emailVerified, image, name)
        .first()
      console.log('created user', result)
      return result
    },
    async getUser(id) {
      return await d1
        .prepare('select * from user where id = ?;')
        .bind(id)
        .first()
    },
    async getUserByEmail(email) {
      return await d1
        .prepare('select * from user where email = ?;')
        .bind(email)
        .first()
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return
    },
    async updateUser(user) {
      return
    },
    async deleteUser(userId) {
      return
    },
    async linkAccount(account) {
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      return
    },
    async getSessionAndUser(sessionToken) {
      return
    },
    async updateSession({ sessionToken }) {
      return
    },
    async deleteSession(sessionToken) {
      return
    }
  }
}
