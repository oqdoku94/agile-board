export type RegisterUserRequest = {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type RegisterUserResponse = {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date
}
