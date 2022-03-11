import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 32, nullable: false })
  public title: string;

  @Column({ nullable: true })
  description?: string;

  @Column('boolean', { nullable: true })
  allDay?: boolean;

  @Column({ nullable: false })
  start: Date;

  @Column({ nullable: true })
  end?: Date;
}
