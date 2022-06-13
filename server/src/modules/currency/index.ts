import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CurrencyController } from 'modules/currency/controllers';
import { CurrencyCron } from 'modules/currency/crons';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { UserModule } from 'modules/user';
import { BillModule } from 'modules/bill';
import { TransactionModule } from 'modules/transaction';

@Module({
  imports: [
    HttpModule,
    // forwardRef(() => UserModule),
    // forwardRef(() => TransactionModule),
    // forwardRef(() => BillModule),
    ClientsModule.register([
      {
        name: 'CURRENCY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'currency',
          protoPath: join(__dirname, '../../../../packages/grpc/currency/src/currency/currency.proto'),
          url: '0.0.0.0:50051',
        },
      },
    ]),
    TypeOrmModule.forFeature([CurrencyRepository]),
  ],
  controllers: [CurrencyController],
  exports: [CurrencyService, CurrencyCron],
  providers: [CurrencyService, CurrencyCron],
})
export class CurrencyModule {}
