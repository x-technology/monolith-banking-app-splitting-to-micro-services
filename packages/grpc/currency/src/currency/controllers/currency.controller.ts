import { Controller, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  GrpcMethod,
} from '@nestjs/microservices';
import { CurrencyService } from '../services';
import { FindAllRequest, FindAllResponse } from '../interfaces/find-all.interface';
import { CurrenciesPageOptionsDto, CurrencyDto } from '../dtos';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly _currencyService: CurrencyService) {}

  @GrpcMethod('HeroService')
  async findAll(data: FindAllRequest): Promise<FindAllResponse> {
    const response = await this._currencyService.getCurrencies(new CurrenciesPageOptionsDto());
    return {
      currencies: response.data.map((c: CurrencyDto) => ({
        uuid: c.uuid,
        name: c.name,
        currentExchangeRate: c.currentExchangeRate,
      })),
    };
  }
}