import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUser } from './model/create-user';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'test1@test.com' },
        { id: 2, email: 'test2@test.com' },
      ];
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOneById(1);

      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneById(999);

      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@test.com');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          email: expect.any(Object),
        },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@test.com');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          email: expect.any(Object),
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUser = {
        email: 'new@test.com',
        password: 'password123',
      };
      const mockCreatedUser = { id: 1, ...createUserDto };
      mockRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });
}); 