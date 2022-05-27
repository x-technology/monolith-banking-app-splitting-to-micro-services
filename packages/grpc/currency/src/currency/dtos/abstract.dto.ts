import { AbstractEntity } from '../entities/abstract.entity';

export class AbstractDto {
  readonly uuid: string;

  constructor(abstract: AbstractEntity) {
    this.uuid = abstract.uuid;
  }
}
