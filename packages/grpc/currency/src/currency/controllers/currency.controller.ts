import { Controller, Inject, OnModuleInit, Param, Get } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
} from '@nestjs/microservices';
import { CurrencyService } from '../services';
import { FindAllRequest, FindAllResponse } from '../interfaces/find-all.interface';
import { CurrenciesPageOptionsDto, CurrencyDto } from '../dtos';

interface CurrencyClient {
  findAll(FindAllRequest): FindAllResponse;
}

@Controller('currency')
export class CurrencyController implements OnModuleInit {
  private currencyClient: CurrencyClient;

  constructor(@Inject('CURRENCY_PACKAGE') private readonly client: ClientGrpc, private readonly _currencyService: CurrencyService) {}

  onModuleInit() {
    this.currencyClient = this.client.getService<CurrencyClient>('CurrencyService');
    console.log('this.currencyClient', this.currencyClient);
  }

  @Get('/')
  async getAll() {
    console.log('test');
    return this.currencyClient.findAll({});
  }

  @GrpcMethod('CurrencyService')
  async findAll(data: FindAllRequest): Promise<FindAllResponse> {
    console.log('request received', data);
    const response = await this._currencyService.getCurrencies(new CurrenciesPageOptionsDto());
    console.log('response', response);
    return {
      currencies: [],
    }
    // return {
    //   currencies: response.data.map((c: CurrencyDto) => ({
    //     uuid: c.uuid,
    //     name: c.name,
    //     currentExchangeRate: c.currentExchangeRate,
    //   })),
    // };
  }
}
