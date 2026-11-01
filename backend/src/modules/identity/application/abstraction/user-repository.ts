import type User from '../../domain/entities/user-entity.js'

export default interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
}
