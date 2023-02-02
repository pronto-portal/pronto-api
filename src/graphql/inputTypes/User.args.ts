import { ArgsType, Field } from "type-graphql";
import User from "../../models/User";

@ArgsType()
export class GetUserArgs {
  @Field(() => String, { nullable: false })
  id: string;
}

@ArgsType()
export class CreateUserArgs {
  @Field(() => String, { nullable: false })
  firstName: string;

  @Field(() => String, { nullable: false })
  lastName: string;

  @Field(() => String, { nullable: true, defaultValue: "" })
  profilePic: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  phone: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isManager: boolean;

  @Field(() => Boolean, { nullable: false, defaultValue: true })
  isTranslator: boolean;
}
