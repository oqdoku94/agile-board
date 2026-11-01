import { describe, it, expect } from 'vitest'
import User from '../../../../src/modules/identity/domain/entities/user-entity.js'
import DomainValidationError from '../../../../src/shared/domain/errors/domain-validation-error.js'

describe('Проверка создания User', () => {
  it('Создание User с корректными данными', () => {
    const user = User.create({
      email: 'test@gmail.com',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    expect(user.email).toBe('test@gmail.com')
    expect(user.firstName).toBe('Test firstName')
    expect(user.lastName).toBe('Test lastName')
    expect(user.passwordHash).toBe('apo2o3fmw1io1ref2i3u2')
    expect(user.id).toBeUndefined()
    expect(user.createdAt).toBeUndefined()
    expect(user.updatedAt).toBeUndefined()
  })

  it("Создание User с сиволами в 'email' разного регистра и пробелами.", () => {
    const user = User.create({
      email: ' TeST@gmAil.COM ',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    expect(user.email).toBe('test@gmail.com')
  })

  it("Создание User с некорректным 'email'.", () => {
    expect(() =>
      User.create({
        email: 'sq121@2',
        firstName: 'Test firstName',
        lastName: 'Test lastName',
        passwordHash: 'apo2o3fmw1io1ref2i3u2',
      }),
    ).toThrow(DomainValidationError)
  })
})

describe('Проверка восстановления User', () => {
  it('Восстановление User с корректными данными.', () => {
    const user = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: new Date('2026-10-01T10:00:00Z'),
      updatedAt: new Date('2026-10-02T10:00:00Z'),
    })

    expect(user.id).toBe('d46d835f-ee0e-49df-bc52-d6ed1cb4df7c')
    expect(user.email).toBe('qwe@test.ru')
    expect(user.firstName).toBe('Test firstName')
    expect(user.lastName).toBe('Test lastName')
    expect(user.passwordHash).toBe('apo2o3fmw1io1ref2i3u2')
    expect(user.createdAt).toEqual(new Date('2026-10-01T10:00:00Z'))
    expect(user.updatedAt).toEqual(new Date('2026-10-02T10:00:00Z'))
  })

  it('Восстановление User с датой создания позже чем датой обновления.', () => {
    expect(() =>
      User.restore({
        id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
        email: 'qwe@test.ru',
        firstName: 'Test firstName',
        lastName: 'Test lastName',
        passwordHash: 'apo2o3fmw1io1ref2i3u2',
        createdAt: new Date('2026-10-03T10:00:00Z'),
        updatedAt: new Date('2026-10-02T10:00:00Z'),
      }),
    ).toThrow(DomainValidationError)
  })

  it('Восстановление User с некорректной датой создания.', () => {
    expect(() =>
      User.restore({
        id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
        email: 'qwe@test.ru',
        firstName: 'Test firstName',
        lastName: 'Test lastName',
        passwordHash: 'apo2o3fmw1io1ref2i3u2',
        createdAt: new Date('invalid'),
        updatedAt: new Date('2026-10-02T10:00:00Z'),
      }),
    ).toThrow(DomainValidationError)
  })

  it('Восстановление User с некорректной датой изменения.', () => {
    expect(() =>
      User.restore({
        id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
        email: 'qwe@test.ru',
        firstName: 'Test firstName',
        lastName: 'Test lastName',
        passwordHash: 'apo2o3fmw1io1ref2i3u2',
        createdAt: new Date('2026-10-03T10:00:00Z'),
        updatedAt: new Date('invalid'),
      }),
    ).toThrow(DomainValidationError)
  })

  it("Восстановление User и отсутствие возможности менять 'createAt' и 'updateAt' через ссылку.", () => {
    const createdAt = new Date('2026-10-01T10:00:00Z')
    const updatedAt = new Date('2026-10-02T10:00:00Z')
    const user = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: createdAt,
      updatedAt: updatedAt,
    })

    createdAt.setFullYear(2045)
    updatedAt.setFullYear(2066)

    expect(user.createdAt).toEqual(new Date('2026-10-01T10:00:00Z'))
    expect(user.updatedAt).toEqual(new Date('2026-10-02T10:00:00Z'))
  })

  it("Восстановление User и отсутствие возможности менять 'createAt' и 'updateAt' через методы.", () => {
    const createdAt = new Date('2026-10-01T10:00:00Z')
    const updatedAt = new Date('2026-10-02T10:00:00Z')
    const user = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: createdAt,
      updatedAt: updatedAt,
    })

    user.createdAt?.setFullYear(2045)
    user.updatedAt?.setFullYear(2066)

    expect(user.createdAt).toEqual(new Date('2026-10-01T10:00:00Z'))
    expect(user.updatedAt).toEqual(new Date('2026-10-02T10:00:00Z'))
  })
})
describe('Изменение имени и фамилии User.', () => {
  it('Изменение имени и фамилии в User на корректные.', () => {
    const user = User.create({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    user.changeName('New firstName', 'New lastName')

    expect(user.firstName).toEqual('New firstName')
    expect(user.lastName).toEqual('New lastName')
  })

  it('Изменение имени и фамилии  User с пробелами в начале или в конце.', () => {
    const user = User.create({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    user.changeName(' New firstName ', ' New lastName ')

    expect(user.firstName).toEqual('New firstName')
    expect(user.lastName).toEqual('New lastName')
  })

  it('Изменение фамилии в User на некорректное.', () => {
    const user = User.create({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    expect(() => user.changeName('New firstName', '')).toThrow(DomainValidationError)

    expect(user.firstName).toBe('Test firstName')
    expect(user.lastName).toBe('Test lastName')
  })

  it('Изменение имени в User на некорректное.', () => {
    const user = User.create({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    expect(() => user.changeName('', 'New lastName')).toThrow(DomainValidationError)

    expect(user.firstName).toBe('Test firstName')
    expect(user.lastName).toBe('Test lastName')
  })
})
