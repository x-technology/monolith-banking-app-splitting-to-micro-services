import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from './strategies';

const configService = new ConfigService();

const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../currency/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true,
  subscribers: [],
  synchronize: false,
  logging: true,
};

console.log(JSON.stringify(config));

export = config;
