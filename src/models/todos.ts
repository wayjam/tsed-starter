import { Required, Property, Format } from '@tsed/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn({name: 'id'})
  @Required()
  public id: number;

  @Column({name: 'time', type: 'timestamp'})
	@Format('date-time')
  @Property()
  public time: Date;

  @Column({ name: 'content' })
  @Property()
  public content: string;

  @Column({ name: 'finished' })
  @Property()
  public finished: boolean;
}
