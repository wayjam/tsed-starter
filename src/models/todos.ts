import { Required } from '@tsed/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  @Required()
  public id: number;

	@Column({
		name: "time"
	})
	public time: Date;
	
  @Column({
    name: 'content'
  })
  public content: string;

	@Column({
		name: "finished"
	})
	public finished: boolean;
}
