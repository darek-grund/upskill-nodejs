import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagersService } from './managers.service';
import { Manager } from './entities/manager.entity';
import { CreateManager } from './model/create-manager';
import { User } from '../users/entities/user.entity';

describe('ManagersService', () => {
  let service: ManagersService;
  let repository: Repository<Manager>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
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
  });

  describe('findOneById', () => {
    it('should return a manager by id', async () => {
      const mockManager = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        user: { id: 1 } as User,
      };

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
  });

  describe('create', () => {
    it('should create a manager without queryRunner', async () => {
      const createManagerDto: CreateManager = {
        firstName: 'John',
        lastName: 'Doe',
        user: { id: 1 } as User,
      };

      const mockManager = {
        id: 1,
        ...createManagerDto,
      };

      mockRepository.save.mockResolvedValue(mockManager);

      const result = await service.create(createManagerDto);

      expect(result).toEqual(mockManager);
      expect(mockRepository.save).toHaveBeenCalledWith(createManagerDto);
    });

    it('should create a manager with queryRunner', async () => {
      const createManagerDto: CreateManager = {
        firstName: 'John',
        lastName: 'Doe',
        user: { id: 1 } as User,
      };

      const mockManager = {
        id: 1,
        ...createManagerDto,
      };

      const mockQueryRunner = {
        manager: {
          save: jest.fn().mockResolvedValue(mockManager),
        },
      };

      const result = await service.create(createManagerDto, mockQueryRunner as any);

      expect(result).toEqual(mockManager);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(Manager, createManagerDto);
    });
  });
}); 