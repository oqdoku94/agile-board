import type IUserRepository from '../../application/abstraction/user-repository.js'
import User from '../../domain/entities/user-entity.js'
import DbContext from '../../../../shared/infrastructure/database/postgres/postgres-connection.js'
import type { UserDao } from '../dao/user-dao.js'
import { DatabaseError } from 'pg'
import EmailAlreadyExistsError from '../../application/errors/email-already-exists.error.js'
import UserNotFoundError from '../../application/errors/user-not-found.error.js'

const findByEmailQuery = 'SELECT * FROM auth.users_get_by_email_function($1)'
const createUserQuery = 'SELECT * FROM auth.users_create_function($1, $2, $3, $4)'
const updateUserQuery = 'SELECT * FROM auth.users_update_function($1, $2, $3, $4, $5)'

class PostgresUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const result = await DbContext.query<UserDao>(createUserQuery, [
        user.email,
        user.firstName,
        user.lastName,
        user.passwordHash,
      ])
      const obj = result.rows[0]

      if (!obj) {
        throw new Error('Не удалось создать пользователя.')
      }

      return this.map(obj)
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          if (error.constraint === 'users_email_unique') {
            throw new EmailAlreadyExistsError()
          }
        }
      }

      throw error
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await DbContext.query<UserDao>(findByEmailQuery, [email])
    const obj = result.rows[0]

    if (!obj) {
      return null
    }

    return this.map(obj)
  }

  async update(user: User): Promise<User> {
    try {
      if (!user.id) {
        throw new Error('Невозможно обновить пользователя без уникального идентификатора.')
      }

      const result = await DbContext.query<UserDao>(updateUserQuery, [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.passwordHash,
      ])
      const obj = result.rows[0]

      if (!obj) {
        throw new Error('Не удалось обновить информацию пользователя.')
      }

      return this.map(obj)
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          if (error.constraint === 'users_email_unique') {
            throw new EmailAlreadyExistsError()
          }
        } else if (error.code === 'P1001') {
          throw new UserNotFoundError()
        }
      }

      throw error
    }
  }

  private map(dao: UserDao): User {
    return User.restore({
      id: dao.id,
      email: dao.email,
      firstName: dao.first_name,
      lastName: dao.last_name,
      passwordHash: dao.password_hash,
      createdAt: dao.created_at,
      updatedAt: dao.updated_at,
    })
  }
}

export default PostgresUserRepository
