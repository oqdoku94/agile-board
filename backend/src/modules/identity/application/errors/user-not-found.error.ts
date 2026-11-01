import BaseError from '../../../../shared/base-error.js'

export default class UserNotFoundError extends BaseError {
  constructor() {
    super('UserNotFoundError', 'Пользователь не найден.')
  }
}
