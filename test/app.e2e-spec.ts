import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('Courses API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /courses/create create course', async () => {
    const response = await request(app.getHttpServer())
      .post('/courses/create')
      .send({
        title: 'NestJS Backend',
        description: 'Описание курса по архитектуре NestJS',
        duration: 12,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'NestJS Backend',
      description: 'Описание курса по архитектуре NestJS',
      duration: 12,
    });

    expect(response.body.id).toBeDefined();
  });
  it('GET /courses/getAll returns courses', async () => {
    const response = await request(app.getHttpServer())
    .get('/courses/getAll')
    .expect(200);

  expect(Array.isArray(response.body)).toBe(true);
});
});