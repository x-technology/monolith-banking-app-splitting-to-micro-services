import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { grpcClientOptions } from '../grpc-client.options';
import { CurrencyController } from './controllers';
import { CurrencyCron } from './crons';
import { CurrencyRepository } from './repositories';
import { CurrencyService } from './services';
import { CurrencyEntity } from './entities';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CURRENCY_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    HttpModule,
    TypeOrmModule.forFeature([CurrencyEntity]),
  ],
  controllers: [CurrencyController],
  exports: [CurrencyService, CurrencyCron],
  providers: [CurrencyService, CurrencyCron, CurrencyRepository],
})
export class CurrencyModule {}
