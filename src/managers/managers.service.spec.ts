import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, QueryRunner, EntityManager } from 'typeorm';
import { ManagersService } from './managers.service';
import { Manager } from './entities/manager.entity';
import { CreateManager } from './model/create-manager';
import { User } from '../users/entities/user.entity';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('ManagersService', () => {
  let service: ManagersService;
  let repository: Repository<Manager>;

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
      mockSave, // expose mockSave for test cases
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
    repository = module.get<Repository<Manager>>(getRepositoryToken(Manager));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all managers', async () => {
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

      const result = await service.findAll();

      expect(result).toEqual(mockManagers);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no managers exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
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
      mockRepository.findOneBy.mockResolvedValue(mockManager);

      const result = await service.findOneById(1);

      expect(result).toEqual(mockManager);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when manager not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneById(999);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should handle database errors', async () => {
      mockRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await expect(service.findOneById(1)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOneById(0)).rejects.toThrow('Invalid manager ID');
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
      mockRepository.save.mockResolvedValue(mockManager);

      const result = await service.create(createManagerDto);

      expect(result).toEqual(mockManager);
      expect(mockRepository.save).toHaveBeenCalledWith(createManagerDto);
    });

    it('should create a manager with queryRunner', async () => {
      const mockQueryRunner = createMockQueryRunner();
      mockQueryRunner.mockSave.mockResolvedValue(mockManager);

      const result = await service.create(createManagerDto, mockQueryRunner);

      expect(result).toEqual(mockManager);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(Manager, createManagerDto);
    });

    it('should handle database errors without queryRunner', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createManagerDto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should handle database errors with queryRunner', async () => {
      const mockQueryRunner = createMockQueryRunner();
      mockQueryRunner.mockSave.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createManagerDto, mockQueryRunner))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('should validate manager data before creation', async () => {
      const invalidManagerDto = {
        firstName: '',
        lastName: '',
        user: { id: 1 } as User,
      };

      await expect(service.create(invalidManagerDto)).rejects.toThrow('Invalid manager data');
    });
  });
}); 