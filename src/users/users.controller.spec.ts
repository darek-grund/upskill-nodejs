import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Manager } from '../managers/entities/manager.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockImplementation((context) => {
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1 };
      return true;
    }),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    manager: null as unknown as Manager,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toEqual([{
        id: mockUser.id,
        email: mockUser.email,
      }]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.getAllUsers();

      expect(result).toEqual([]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockUsersService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await controller.getUserByEmail(email);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException when user not found', async () => {
      const email = 'nonexistent@example.com';
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(controller.getUserByEmail(email)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid email format', async () => {
      const invalidEmail = 'invalid-email';

      await expect(controller.getUserByEmail(invalidEmail)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const id = 1;
      mockUsersService.findOneById.mockResolvedValue(mockUser);

      const result = await controller.getUser(id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when user not found', async () => {
      const id = 999;
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(controller.getUser(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id' as unknown as number;

      await expect(controller.getUser(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException for invalid email format', async () => {
      const createUserDto: CreateUserDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(controller.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for password too short', async () => {
      const createUserDto: CreateUserDto = {
        email: 'valid@example.com',
        password: '123',
      };

      await expect(controller.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle service errors during user creation', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
      };
      mockUsersService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow('Database error');
    });
  });
}); 