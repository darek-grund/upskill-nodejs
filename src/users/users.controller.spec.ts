import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

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
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });
}); 