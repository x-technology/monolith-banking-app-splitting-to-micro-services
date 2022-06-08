import { Controller, Inject, OnModuleInit, Param, Get } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
} from '@nestjs/microservices';
import { CurrencyService } from '../services';
import { FindAllRequest, FindAllResponse, CurrencyServiceInterface } from '../interfaces/currencyService.interface';
import { CurrenciesPageOptionsDto, CurrencyDto } from '../dtos';

@Controller('')
export class CurrencyController implements OnModuleInit {
  private currencyClient: CurrencyServiceInterface;

  constructor(@Inject('CURRENCY_PACKAGE') private readonly client: ClientGrpc, private readonly _currencyService: CurrencyService) {}

  onModuleInit() {
    this.currencyClient = this.client.getService<CurrencyServiceInterface>('CurrencyService');
  }

  @Get('/')
  async getAll() {
    return this.currencyClient.findAll({});
  }

  @GrpcMethod('CurrencyService')
  async findAll(data: FindAllRequest): Promise<FindAllResponse> {
    console.log('grpc findAll requested');
    const response = await this._currencyService.getCurrencies(new CurrenciesPageOptionsDto());
    console.log('response', response);
    return {
      currencies: response.data.map((c: CurrencyDto) => ({
        uuid: c.uuid,
        name: c.name,
        currentExchangeRate: c.currentExchangeRate,
      })),
      meta: {
        ...response.meta,
      }
    };
  }
}
