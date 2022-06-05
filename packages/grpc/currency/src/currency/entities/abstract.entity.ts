import { Column, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractDto } from '../dtos/abstract.dto';
import { UtilsService } from '../utils/utils.service';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
