import { AuthService } from '../src/services/AuthService';
import { UserRepository } from '../src/repositories/UserRepository';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('../src/repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('../src/services/EmailService', () => ({
  emailService: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendEmail: jest.fn().mockResolvedValue(true),
  }
}));
jest.mock('../src/config/database', () => ({
  prisma: {
    $transaction: jest.fn().mockResolvedValue({ id: '1', role: 'STUDENT', email: 'test@test.com' })
  }
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      (UserRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login({ email: 'test@test.com', password: 'pwd' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password invalid', async () => {
      (UserRepository.prototype.findByEmail as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hashed',
        role: 'STUDENT',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({ email: 'test@test.com', password: 'wrongpassword' }))
        .rejects.toThrow('Invalid credentials');
    });
  });
});
