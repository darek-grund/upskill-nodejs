import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let usersService: UsersService;

  const testUser: CreateUserDto = {
    email: 'test@example.com',
    password: 'password123',
    notifyByEmail: true,
    notifyByPhone: false,
  };

  const adminUser: CreateUserDto = {
    email: 'admin@example.com',
    password: 'admin123',
    notifyByEmail: true,
    notifyByPhone: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
      }),
    );
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();

    await usersService.create(adminUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return array of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /users/search', () => {
    it('should return user by email', async () => {
      const user = await usersService.create(testUser);

      return request(app.getHttpServer())
        .get('/users/search')
        .query({ email: user.email })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('email', user.email);
        });
    });

    it('should return 404 when user not found', () => {
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ email: 'nonexistent@example.com' })
        .expect(404);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const user = await usersService.create({
        ...testUser,
        email: 'another@example.com',
      });

      return request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', user.id);
          expect(res.body).toHaveProperty('email', user.email);
        });
    });

    it('should return 404 when user not found', () => {
      return request(app.getHttpServer()).get('/users/999999').expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create new user', async () => {
      const newUser = {
        email: 'new@example.com',
        password: 'password123',
      } as CreateUserDto;

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', newUser.email);
    });

    it('should return 401 when not authorized', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(401);
    });

    it('should return 400 when invalid data', () => {
      const invalidUser = {
        email: 'not-an-email',
        password: '123',
        notifyByEmail: 'not-a-boolean',
        phone: 'not-a-phone-number',
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUser)
        .expect(400);
    });
  });
});
