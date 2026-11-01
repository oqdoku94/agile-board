import BaseError from '../../base-error.js'

class DomainValidationError extends BaseError {
  constructor(message: string) {
    super('DomainValidationError', message)
  }
}

export default DomainValidationError
