const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/auth.service');

// Mock authService methods
jest.mock('../src/services/auth.service');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a user', async () => {
      const mockResult = {
        user: {
          id: 'mockUserId',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'Customer'
        },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123'
      };

      authService.register.mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toEqual('jane@example.com');
      expect(res.body.data.accessToken).toEqual('access_token_123');
      expect(authService.register).toHaveBeenCalledTimes(1);
    });

    it('should return 422 if input validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'jane@example.com' // Missing name and password
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toEqual('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in a user', async () => {
      const mockResult = {
        user: {
          id: 'mockUserId',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'Customer'
        },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123'
      };

      authService.login.mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });
  });
});
