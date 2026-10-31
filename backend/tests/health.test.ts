import { describe, it, expect } from 'vitest'
import app from '../src/app'
import request from 'supertest'

describe('GET /health', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      status: 'ok',
    })
  })
})
