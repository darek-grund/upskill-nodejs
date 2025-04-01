import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'correctPassword',
    };

    const mockToken = 'mock.jwt.token';

    it('should return access token when credentials are valid', async () => {
      // Arrange
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.signIn(mockUser.email, mockUser.password);

      // Assert
      expect(result).toEqual({ access_token: mockToken });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      // Act
      const signInPromise = service.signIn(mockUser.email, 'wrongPassword');

      // Assert
      await expect(signInPromise).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      // Act
      const signInPromise = service.signIn(
        'nonexistent@example.com',
        'anyPassword',
      );

      // Assert
      await expect(signInPromise).rejects.toThrow(UnauthorizedException);
    });
  });
});
