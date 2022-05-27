import { AbstractEntity } from './abstract.entity';
import { Column, Entity, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'currency' })
export class CurrencyEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column('float')
  currentExchangeRate: number;

  @Column({ default: false })
  base: boolean;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;
}
