import DomainError from './DomainError.js'

class DomainValidationError extends DomainError {
  constructor(message: string) {
    super(1, message)
  }
}

export default DomainValidationError
