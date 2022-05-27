import { HttpService, Injectable } from '@nestjs/common';
import { PageMetaDto } from '../dtos/page-meta.dto';
import { ForeignExchangeRatesNotFoundException } from '../exceptions/foreign-exchange-rates-not-found.exception';
import {
  CurrenciesPageDto,
  CurrenciesPageOptionsDto,
} from '../dtos';
import { CurrencyEntity } from '../entities';
import { CurrencyRepository } from '../repositories';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly _currencyRepository: CurrencyRepository,
    private readonly _httpService: HttpService,
  ) {}

  public async getCurrencies(
    pageOptionsDto: CurrenciesPageOptionsDto,
  ): Promise<CurrenciesPageDto | undefined> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    const [currencies, currenciesCount] = await queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: currenciesCount,
    });

    return new CurrenciesPageDto(currencies.toDtos(), pageMetaDto);
  }

  public async findCurrency(
    options: Partial<{ uuid: string; name: string }>,
  ): Promise<CurrencyEntity | undefined> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    if (options.uuid) {
      queryBuilder.orWhere('currency.uuid = :uuid', {
        uuid: options.uuid,
      });
    }

    if (options.name) {
      queryBuilder.orWhere('currency.name = :name', {
        name: options.name,
      });
    }

    return queryBuilder.getOne();
  }

  public async upsertCurrencyForeignExchangeRates(
    name: string,
    currentExchangeRate: number,
    base: boolean,
  ): Promise<void> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    await queryBuilder
      .insert()
      .values({ name, currentExchangeRate, base })
      .onConflict(
        `("name") DO UPDATE
                SET current_exchange_rate = :currentExchangeRate`,
      )
      .setParameter('currentExchangeRate', currentExchangeRate)
      .execute();
  }

  public async getCurrencyForeignExchangeRates(): Promise<any> {
    const base = 'GBP';
    const currencies = ['EUR', 'USD', 'RUB'];
    const endpoint = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currencies.join(',')}&tsyms=${base}`;

    return this._httpService
      .get(endpoint)
      .toPromise()
      .then((response) => {
        // data: { EUR: { GBP: 0.8485 }, USD: { GBP: 0.8157 }, RUB: { GBP: 0.01245 } }
        const data = currencies.reduce((prev: Object, currency: string) => {
          prev[currency] = 1/response.data[currency][base];
          return prev;
        }, {});
        return data;
      })
      .catch((error) => {
        throw new ForeignExchangeRatesNotFoundException(error);
      });
  }
}
