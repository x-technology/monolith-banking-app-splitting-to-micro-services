import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';
import { CurrencyEntity } from '../entities';

export class CurrencyDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly currentExchangeRate: number;

  constructor(currency: CurrencyEntity) {
    super(currency);
    this.name = currency.name;
    this.currentExchangeRate = currency.currentExchangeRate;
  }
}
