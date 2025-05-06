import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Manager } from '../managers/entities/manager.entity';
import { Contractor } from '../contractors/entities/contractor.entity';

describe('UsersController', () => {
  let controller: UsersController;

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
    contractor: null as unknown as Contractor,
    notifyByEmail: true,
    notifyByPhone: true,
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      // Act
      const result = await controller.getAllUsers();

      // Assert
      expect(result).toEqual([
        {
          id: mockUser.id,
          email: mockUser.email,
          notifyByEmail: mockUser.notifyByEmail,
          notifyByPhone: mockUser.notifyByPhone,
        },
      ]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      mockUsersService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.getAllUsers();

      // Assert
      expect(result).toEqual([]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await controller.getUserByEmail(email);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        notifyByEmail: mockUser.notifyByEmail,
        notifyByPhone: mockUser.notifyByPhone,
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      // Arrange
      const id = 1;
      mockUsersService.findOneById.mockResolvedValue(mockUser);

      // Act
      const result = await controller.getUser(id);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        notifyByEmail: mockUser.notifyByEmail,
        notifyByPhone: mockUser.notifyByPhone,
      });
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        notifyByEmail: true,
        notifyByPhone: true,
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      // Act
      const result = await controller.createUser(createUserDto);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        notifyByEmail: mockUser.notifyByEmail,
        notifyByPhone: mockUser.notifyByPhone,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: createUserDto.password,
        phone: undefined,
      });
    });
  });
});
