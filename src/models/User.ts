import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import Assignment from "./Assignment";

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ nullable: false })
  firstName: string;

  @Field(() => String)
  @Column({ nullable: false })
  lastName: string;

  @Field(() => String)
  @Column({ nullable: true })
  profilePic: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  email: string;

  @Field(() => String)
  @Column({ nullable: false })
  phone: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isManager: boolean;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isTranslator: boolean;

  @Field(() => Date)
  @Column("date")
  dateCreated: Date;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  isBanned: boolean;

  @Field(() => [Assignment])
  @OneToMany(() => Assignment, (assignment) => assignment.createdBy)
  assignments: Assignment;

  @Field(() => [Assignment])
  @OneToMany(() => Assignment, (assignment) => assignment.assignedTo)
  assigned: Assignment;

  @BeforeInsert()
  validateFields = () => {
    this.dateCreated = new Date(Date.now());
    // validate email
    // validate phone number
    // encrypt password
  };
}

export default User;
