import { describe, expect, it } from 'vitest'
import BcryptPasswordHasher from '../../../../src/modules/identity/infrastructure/security/bcrypt-password-hasher'

describe('Проверка хэширование пароля с использованием bcrypt.', () => {
  it('Хэширование.', async () => {
    const passwordHasher = new BcryptPasswordHasher()
    const password = '1233alweio231231AW1s'

    const result = await passwordHasher.hash(password)
    expect(typeof result).toBe('string')
    expect(result).not.toBe(password)
  })
  it('Правильный пароль.', async () => {
    const passwordHasher = new BcryptPasswordHasher()
    const password = '1233alweio231231AW1s'
    const hash = await passwordHasher.hash(password)

    const result = await passwordHasher.verify(password, hash)
    expect(result).toBe(true)
  })
  it('Неправильный пароль.', async () => {
    const passwordHasher = new BcryptPasswordHasher()
    const password = '1233alweio231231AW1s'
    const hash = await passwordHasher.hash(password)
    const wrongPassword = '123'

    const result = await passwordHasher.verify(wrongPassword, hash)
    expect(result).toBe(false)
  })
})
