import { Resolver, Query, Args, Mutation } from "type-graphql";
import User from "../../models/User";
import { CreateUserArgs, GetUserArgs } from "../inputTypes/User.args";

@Resolver()
class UserResolver {
  @Query(() => User)
  async getUser(@Args() { id }: GetUserArgs) {
    const user = await User.findOneOrFail({ where: { id } });
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args()
    {
      firstName,
      lastName,
      profilePic,
      email,
      phone,
      isManager,
      isTranslator,
    }: CreateUserArgs
  ) {
    const user = await User.create({
      firstName,
      lastName,
      profilePic,
      email,
      phone,
      isManager,
      isTranslator,
    });

    return user;
  }
}

export default UserResolver;
