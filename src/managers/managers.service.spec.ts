import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner, EntityManager } from 'typeorm';
import { ManagersService } from './managers.service';
import { Manager } from './entities/manager.entity';
import { CreateManager } from './model/create-manager';
import { User } from '../users/entities/user.entity';

describe('ManagersService', () => {
  let service: ManagersService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const createMockQueryRunner = () => {
    const mockSave = jest.fn();
    return {
      manager: {
        save: mockSave,
      } as unknown as EntityManager,
      connection: {} as any,
      isReleased: false,
      isTransactionActive: false,
      broadcaster: {} as any,
      release: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      query: jest.fn(),
      mockSave,
    } as unknown as QueryRunner & { mockSave: jest.Mock };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagersService,
        {
          provide: getRepositoryToken(Manager),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ManagersService>(ManagersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all managers', async () => {
      // Arrange
      const mockManagers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          user: { id: 1 } as User,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          user: { id: 2 } as User,
        },
      ];
      mockRepository.find.mockResolvedValue(mockManagers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockManagers);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no managers exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    const mockManager = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      user: { id: 1 } as User,
    };

    it('should return a manager by id', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(mockManager);

      // Act
      const result = await service.findOneById(1);

      // Assert
      expect(result).toEqual(mockManager);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when manager not found', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(null);

      // Act
      const result = await service.findOneById(999);

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('create', () => {
    const createManagerDto: CreateManager = {
      firstName: 'John',
      lastName: 'Doe',
      user: { id: 1 } as User,
    };

    const mockManager = {
      id: 1,
      ...createManagerDto,
    };

    it('should create a manager without queryRunner', async () => {
      // Arrange
      mockRepository.save.mockResolvedValue(mockManager);

      // Act
      const result = await service.create(createManagerDto);

      // Assert
      expect(result).toEqual(mockManager);
      expect(mockRepository.save).toHaveBeenCalledWith(createManagerDto);
    });

    it('should create a manager with queryRunner', async () => {
      // Arrange
      const mockQueryRunner = createMockQueryRunner();
      mockQueryRunner.mockSave.mockResolvedValue(mockManager);

      // Act
      const result = await service.create(createManagerDto, mockQueryRunner);

      // Assert
      expect(result).toEqual(mockManager);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        Manager,
        createManagerDto,
      );
    });
  });
});
