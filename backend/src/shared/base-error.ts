abstract class BaseError extends Error {
  protected constructor(name: string, message?: string) {
    super(message)
    this.name = name
  }
}

export default BaseError
