import type IUserRepository from '../abstraction/user-repository.js'
import type IPasswordHasher from '../abstraction/password-hasher.js'
import type { RegisterUserRequest, RegisterUserResponse } from '../dto/register-user-dto.js'
import EmailAlreadyExistsError from '../errors/email-already-exists.error.js'
import User from '../../domain/entities/user-entity.js'

export default class RegisterUserUseCase {
  private repository: IUserRepository
  private passwordHasher: IPasswordHasher

  constructor(repository: IUserRepository, passwordHasher: IPasswordHasher) {
    this.repository = repository
    this.passwordHasher = passwordHasher
  }

  public async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const email = User.normalizeEmail(request.email)
    const user: User | null = await this.repository.findByEmail(email)

    if (user) {
      throw new EmailAlreadyExistsError()
    }

    const hash = await this.passwordHasher.hash(request.password)
    const newUser = User.create({
      firstName: request.firstName,
      lastName: request.lastName,
      passwordHash: hash,
      email: email,
    })

    const savedUser = await this.repository.create(newUser)

    if (!savedUser.id) {
      throw new Error(`Не присвоился уникальный идентификатор после создания пользователя.`)
    }

    if (!savedUser.createdAt) {
      throw new Error(`Не присвоилась дата создания после создания пользователя.`)
    }

    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      createdAt: savedUser.createdAt,
    }
  }
}
