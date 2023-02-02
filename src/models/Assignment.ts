import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity()
class Assignment extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.assigned, { nullable: false })
  assignedTo: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.assignments, { nullable: false })
  createdBy: User;

  @Field(() => Date)
  @Column("datetime", { nullable: false })
  dateTime: Date;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  completed: boolean;

  @Field(() => String)
  @Column({ nullable: false })
  claimantFirstName: string;

  @Field(() => String)
  @Column({ nullable: false })
  claimantLastName: string;

  @Field(() => String)
  @Column({ nullable: false })
  claimantPhone: string;

  @Field(() => String)
  @Column({ nullable: true })
  claimantEmail: string;

  @Field(() => String)
  @Column({ nullable: false })
  language: string;

  @Field(() => String)
  @Column({ nullable: false })
  address1: string;

  @Field(() => String)
  @Column({ nullable: false })
  address2: string;

  @Field(() => String)
  @Column({ nullable: false })
  state: string;

  @Field(() => String)
  @Column({ nullable: false })
  zipCode: string;
}

export default Assignment;
