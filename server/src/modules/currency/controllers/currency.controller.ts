import {
  Controller,
  Get,
  HttpCode,
  HttpStatus, Inject, OnModuleInit,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrenciesPageDto,
  CurrenciesPageOptionsDto, CurrencyDto,
} from 'modules/currency/dtos';
import { CurrencyServiceInterface } from '../interfaces/currencyService.interface';
import { PageMetaDto } from "common/dtos";

@Controller('Currencies')
@ApiTags('Currencies')
export class CurrencyController implements OnModuleInit {
  private currencyService: CurrencyServiceInterface;

  constructor(
    @Inject('CURRENCY_PACKAGE') private client: ClientGrpc
  ) {
  }

  onModuleInit() {
    this.currencyService = this.client.getService<CurrencyServiceInterface>('CurrencyService');
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get currency',
    type: CurrenciesPageDto,
  })
  async getAvailableCurrencies(
    @Query(new ValidationPipe({ transform: true }))
      pageOptionsDto: CurrenciesPageOptionsDto,
  ): Promise<CurrenciesPageDto> {
    const response = await this.currencyService.findAll({}).toPromise();
    console.log('response', response);
    return new CurrenciesPageDto(
      response.currencies.map((c) => (c as unknown as CurrencyDto)),
      response.meta as unknown as PageMetaDto,
    );
    // return this._currencyService.getCurrencies(pageOptionsDto);
  }
}
