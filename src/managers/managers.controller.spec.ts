import { Test, TestingModule } from '@nestjs/testing';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { UsersService } from 'src/users/users.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { DataSource, QueryRunner } from 'typeorm';

describe('ManagersController', () => {
  let controller: ManagersController;
  let managersService: ManagersService;
  let usersService: UsersService;
  let dataSource: DataSource;

  const mockManagersService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  } as unknown as QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagersController],
      providers: [
        {
          provide: ManagersService,
          useValue: mockManagersService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<ManagersController>(ManagersController);
    managersService = module.get<ManagersService>(ManagersService);
    usersService = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);

    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllManagers', () => {
    it('should return all managers', async () => {
      // Arrange
      const mockManagers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          user: {
            email: 'john@example.com',
          },
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          user: {
            email: 'jane@example.com',
          },
        },
      ];
      mockManagersService.findAll.mockResolvedValue(mockManagers);

      // Act
      const result = await controller.getAllManagers();

      // Assert
      expect(result).toEqual([
        {
          id: 1,
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          id: 2,
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      ]);
      expect(mockManagersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createManager', () => {
    const mockCreateManagerDto: CreateManagerDto = {
      firstName: 'New',
      lastName: 'Manager',
      email: 'manager@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'manager@example.com',
    };

    const mockManager = {
      id: 1,
      firstName: 'New',
      lastName: 'Manager',
      user: mockUser,
    };

    it('should create a new manager successfully', async () => {
      // Arrange
      mockUsersService.create.mockResolvedValue(mockUser);
      mockManagersService.create.mockResolvedValue(mockManager);

      // Act
      const result = await controller.createManager(mockCreateManagerDto);

      // Assert
      expect(result).toEqual({
        id: 1,
        email: 'manager@example.com',
        firstName: 'New',
        lastName: 'Manager',
      });
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockManagersService.create).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      mockUsersService.create.mockRejectedValue(new Error('Database error'));

      // Act
      await expect(
        controller.createManager(mockCreateManagerDto),
      ).rejects.toThrow('Database error');

      // Assert
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
