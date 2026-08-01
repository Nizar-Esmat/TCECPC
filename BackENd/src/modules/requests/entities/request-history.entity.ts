import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract/abstract.entity';
import { RequestStatus } from '../../../common/enums/request-status.enum';
import { User } from '../../users/entities/user.entity';
import { Request } from './request.entity';

@Entity('request_history')
export class RequestHistory extends AbstractEntity {
  @ManyToOne(() => Request, { nullable: false, onDelete: 'CASCADE' })
  request: Request;

  @Column({ type: 'uuid' })
  requestId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @Column({ type: 'uuid', name: 'changed_by' })
  changedById: string;

  @Column({ type: 'enum', enum: RequestStatus })
  status: RequestStatus;
}
