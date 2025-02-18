import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;  

  @ManyToOne(() => User, (user) => user.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  creator: User

  @Column({ type: 'int' })
  _public: number;

  @Column({ type: 'int' })
  _default: number;

  @OneToMany(() => PollSection, (pollSection) => pollSection.poll, { cascade: true })
  @JoinColumn({ name: 'name' })
  sections: PollSection[];

  @OneToOne(() => Poll, (child) => child.id, { cascade: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'overwrittenBy' })
  readonly child?: Poll;

  @Column({ type: 'varchar' })
  title: string;

  setCreator(user: User) { this.creator = user; }
}

@Entity('poll_sections')
export class PollSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Poll, (poll) => poll.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  poll: Poll;

  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => PollQuestion, (pollQuestion) => pollQuestion.section, { cascade: true })
  @JoinColumn({ name: 'questionId' })
  questions: PollQuestion[];

  @Column({ type: 'int' })
  orderNumber: number;
}

@Entity('poll_questions')
export class PollQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PollSection, (pollSection) => pollSection.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  section: PollSection;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'int' })
  orderNumber: number;
}
