import { describe, it, expect, vi, assert } from 'vitest'
import type IUserRepository from '../../../../src/modules/identity/application/abstraction/user-repository'
import type IPasswordHasher from '../../../../src/modules/identity/application/abstraction/password-hasher'
import User from '../../../../src/modules/identity/domain/entities/user-entity'
import RegisterUserUseCase from '../../../../src/modules/identity/application/use-cases/register-user.use-case'
import EmailAlreadyExistsError from '../../../../src/modules/identity/application/errors/email-already-exists.error'

describe('Проверка создания пользователя.', () => {
  it('Успешная регистрация.', async () => {
    const savedUser = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: new Date('2026-10-01T10:00:00Z'),
      updatedAt: new Date('2026-10-02T10:00:00Z'),
    })

    const mockUserRepository: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(savedUser),
      update: vi.fn().mockResolvedValue(null),
    }

    const mockPasswordHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('apo2o3fmw1io1ref2i3u2'),
      verify: vi.fn().mockResolvedValue(true),
    }

    const registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher)
    const result = await registerUserUseCase.execute({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      password: 'testpassword',
    })

    expect(result.id).toEqual(savedUser.id)
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('qwe@test.ru')
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('testpassword')
    expect(mockUserRepository.create).toHaveBeenCalledOnce()
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User))

    const createdUser = vi.mocked(mockUserRepository.create).mock.calls[0]?.[0]
    assert.isDefined(createdUser)

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.email).toEqual('qwe@test.ru')
    expect(createdUser.passwordHash).toEqual('apo2o3fmw1io1ref2i3u2')
    expect(result).not.toHaveProperty('passwordHash')
  })

  it('Пользователь с таким email уже существует.', async () => {
    const savedUser = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: new Date('2026-10-01T10:00:00Z'),
      updatedAt: new Date('2026-10-02T10:00:00Z'),
    })

    const mockUserRepository: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(savedUser),
      create: vi.fn(),
      update: vi.fn(),
    }

    const mockPasswordHasher: IPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    }

    const registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher)

    await expect(
      registerUserUseCase.execute({
        email: 'qwe@test.ru',
        firstName: 'Test firstName',
        lastName: 'Test lastName',
        password: 'testpassword',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.create).not.toHaveBeenCalled()
  })
  it('Репозиторий вернул пользователя без уникального идентификатора.', async () => {
    const savedUser = User.create({
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
    })

    const mockUserRepository: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(savedUser),
      update: vi.fn(),
    }

    const mockPasswordHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('apo2o3fmw1io1ref2i3u2'),
      verify: vi.fn(),
    }

    const request = {
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      password: 'testpassword',
    }

    const registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher)
    await expect(registerUserUseCase.execute(request)).rejects.toThrow(
      `Не присвоился уникальный идентификатор после создания пользователя.`,
    )
  })
  it('Нормализация email до передачи в репозиторий.', async () => {
    const savedUser = User.restore({
      id: 'd46d835f-ee0e-49df-bc52-d6ed1cb4df7c',
      email: 'qwe@test.ru',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      passwordHash: 'apo2o3fmw1io1ref2i3u2',
      createdAt: new Date('2026-10-01T10:00:00Z'),
      updatedAt: new Date('2026-10-02T10:00:00Z'),
    })

    const request = {
      email: ' QWE@TEST.RU  ',
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      password: 'testpassword',
    }

    const mockUserRepository: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(savedUser),
      update: vi.fn(),
    }

    const mockPasswordHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('apo2o3fmw1io1ref2i3u2'),
      verify: vi.fn(),
    }

    const registerUserUseCase = new RegisterUserUseCase(mockUserRepository, mockPasswordHasher)
    const result = await registerUserUseCase.execute(request)

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('qwe@test.ru')
    const createdUser = vi.mocked(mockUserRepository.create).mock.calls[0]?.[0]
    assert.isDefined(createdUser)
    expect(createdUser.email).toEqual('qwe@test.ru')
    expect(result.email).toEqual('qwe@test.ru')
  })
})
