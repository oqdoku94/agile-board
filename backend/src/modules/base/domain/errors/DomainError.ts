abstract class DomainError extends Error {
  private _code: number | undefined

  public get code() {
    return this._code
  }

  constructor(code?: number, message?: string) {
    super(message)
    this._code = code
  }
}

export default DomainError
