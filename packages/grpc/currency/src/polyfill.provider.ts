import 'source-map-support/register';

import { AbstractDto } from './currency/dtos/abstract.dto';
import { AbstractEntity } from './currency/entities/abstract.entity';
import * as _ from 'lodash';

declare global {
  interface Array<T> {
    toDtos<B extends AbstractDto>(this: AbstractEntity[]): B[];
  }
}

Array.prototype.toDtos = function <B extends AbstractDto>(options?: any): B[] {
  return <B[]>_(this)
    .map((item) => item.toDto(options))
    .compact()
    .value();
};
