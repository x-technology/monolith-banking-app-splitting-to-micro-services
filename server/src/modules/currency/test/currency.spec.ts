import * as request from 'supertest';
import { SnakeNamingStrategy } from 'utils/strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import 'providers/polyfill.provider';
import { CurrencyModule } from '..';
import { CurrencyService } from '../services';
import { HttpModule, HttpService, INestApplication, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from '../entities';
import { Repository } from 'typeorm';
import { AppModule } from 'modules/app';

// @Module({})
// class UserModule {}

// @Module({})
// class TransactionModule {}

// @Module({})
// class BillModule {}

@Module({})
class UserModule {}

@Module({})
class TransactionModule {}

@Module({})
class BillModule {}

jest.mock('modules/user', () => {
  return {
    UserModule: {
      forRootAsync: jest.fn().mockImplementation(() => UserModule),
    },
  };
});

jest.mock('modules/transaction', () => {
  return {
    TransactionModule: {
      forRootAsync: jest.fn().mockImplementation(() => TransactionModule),
    },
  };
});

jest.mock('modules/bill', () => {
  return {
    BillModule: {
      forRootAsync: jest.fn().mockImplementation(() => BillModule),
    }
  };
});

describe('Currency', () => {
  let app: INestApplication;
  let repository: Repository<CurrencyEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CurrencyModule,
        TypeOrmModule.forRootAsync({
          imports: [],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: ['./**/*.entity.ts'],
            migrations: ['./migrations/*.ts'],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: false,
            subscribers: [],
            migrationsRun: true,
            logging: true,
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    repository = module.get('CurrencyRepository');
  });

  beforeEach(async () => {
    await repository.query(`DELETE FROM currency;`);
  });

  it(`GET /currencies`, async () => {
    // Pre-populate the DB with some dummy users
    await repository.save([
      { name: 'GBP', currentExchangeRate: 1, },
      { name: 'USD', currentExchangeRate: 0.834, },
    ]);

    // Run your end-to-end test
    const { body } = await request.agent(app.getHttpServer())
      .get('/currencies')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    const {data, meta} = body;
    expect(data).toEqual([
      { uuid: expect.any(String), name: 'GBP', currentExchangeRate: 1 },
      { uuid: expect.any(String), name: 'USD', currentExchangeRate: 0.834 },
    ]);
    expect(meta).toEqual({
      itemCount: 2, page: 1, pageCount: 1, take: 10,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
