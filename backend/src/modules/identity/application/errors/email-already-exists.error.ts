import BaseError from '../../../../shared/base-error.js'

export default class EmailAlreadyExistsError extends BaseError {
  constructor() {
    super('EmailAlreadyExistsError', 'Почтовый ящик уже существует.')
  }
}
