import { Column, Entity, Unique } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract/abstract.entity';
import { Hall } from '../../../common/enums/hall.enum';

@Entity('teams')
@Unique(['hall', 'teamNumber'])
export class Team extends AbstractEntity {
  @Column({ type: 'enum', enum: Hall })
  hall: Hall;

  @Column()
  teamNumber: number;
}
