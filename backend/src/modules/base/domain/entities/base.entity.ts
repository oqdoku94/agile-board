import DomainValidationError from '../errors/DomainValidationError.js'

abstract class BaseEntity {
  private _id?: string

  protected setId(value: string) {
    if (!value || value.length === 0 || value.trim().length === 0) {
      throw new DomainValidationError("'id' должно быть заполнено.")
    }

    if (this._id) {
      throw new DomainValidationError("'id' уже заполнено.")
    }

    this._id = value
  }

  public get id(): string | undefined {
    return this._id
  }
}

export default BaseEntity
