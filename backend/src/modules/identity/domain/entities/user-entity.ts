import BaseEntity from '../../../../shared/domain/entities/base.entity.js'
import DomainValidationError from '../../../../shared/domain/errors/domain-validation-error.js'
import { emailPattern } from '../../../../utils/patterns.js'

class User extends BaseEntity {
  private readonly _email: string
  private _firstName: string
  private _lastName: string
  private readonly _passwordHash: string
  private _createdAt?: Date
  private _updatedAt?: Date

  private constructor(props: CreateUserProps) {
    super()
    this._email = User.normalizeEmail(props.email)
    this._firstName = User.normalizeFirstName(props.firstName)
    this._lastName = User.normalizeLastName(props.lastName)
    this._passwordHash = User.normalizePasswordHash(props.passwordHash)
  }

  public get email(): string {
    return this._email
  }
  public get firstName(): string {
    return this._firstName
  }

  public get lastName(): string {
    return this._lastName
  }

  public get passwordHash(): string {
    return this._passwordHash
  }

  public get createdAt(): Date | undefined {
    if (this._createdAt) return new Date(this._createdAt)

    return undefined
  }

  public get updatedAt(): Date | undefined {
    if (this._updatedAt) return new Date(this._updatedAt)

    return undefined
  }

  public static normalizeEmail(value: string): string {
    if (!value) {
      throw new DomainValidationError("'email' должно быть заполнено.")
    }

    const normalizedValue = value.trim().toLowerCase()
    if (normalizedValue.length === 0) {
      throw new DomainValidationError("'email' должно быть заполнено.")
    }

    if (!emailPattern.test(normalizedValue)) {
      throw new DomainValidationError("'email' имеет неверный формат.")
    }

    return normalizedValue
  }

  public static normalizeFirstName(value: string): string {
    if (!value) {
      throw new DomainValidationError("'firstName' должно быть заполнено.")
    }

    const normalizedValue = value.trim()
    if (normalizedValue.length === 0) {
      throw new DomainValidationError("'firstName' должно быть заполнено.")
    }

    if (normalizedValue.length < 2 || normalizedValue.length > 50) {
      throw new DomainValidationError("'firstName' должно быть не меньше 2 символов и не более 50.")
    }

    return normalizedValue
  }

  public static normalizeLastName(value: string): string {
    if (!value) {
      throw new DomainValidationError("'lastName' должно быть заполнено.")
    }

    const normalizedValue = value.trim()
    if (normalizedValue.length === 0)
      throw new DomainValidationError("'lastName' должно быть заполнено.")

    if (normalizedValue.length < 2 || normalizedValue.length > 50) {
      throw new DomainValidationError("'lastName' должно быть не меньше 2 символов и не более 50.")
    }

    return normalizedValue
  }

  public static normalizePasswordHash(value: string): string {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationError("'passwordHash' должно быть заполнено.")
    }

    return value
  }

  public changeName(firstName: string, lastName: string): void {
    const newFirstName = User.normalizeFirstName(firstName)
    const newLastName = User.normalizeLastName(lastName)

    this._firstName = newFirstName
    this._lastName = newLastName
  }

  static create(props: CreateUserProps): User {
    return new User(props)
  }

  static restore(props: RestoreUserProps): User {
    if (!(props.createdAt instanceof Date) || isNaN(props.createdAt.getTime()))
      throw new DomainValidationError("'createdAt' не является датой.'.")

    if (!(props.updatedAt instanceof Date) || isNaN(props.updatedAt.getTime()))
      throw new DomainValidationError("'updatedAt' не является датой.'.")

    if (props.createdAt > props.updatedAt)
      throw new DomainValidationError("'createdAt' не может быть больше 'updatedAt'.")

    const user = new User(props)

    user.setId(props.id)
    user._createdAt = new Date(props.createdAt)
    user._updatedAt = new Date(props.updatedAt)

    return user
  }
}

type CreateUserProps = {
  email: string
  firstName: string
  lastName: string
  passwordHash: string
}

type RestoreUserProps = {
  id: string
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export default User
