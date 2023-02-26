import { extendType } from "nexus";
import { Context } from "../../schema/context";

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("GetUser", {
      type: "String",
      async resolve(_root, args, ctx: Context) {
        // const user = await ctx.prisma.user.create({
        //   data: input,
        // });

        // const user = await ctx.prisma.user.findUnique({where: {
        //     ctx.user.
        // }})
        console.log("CONTEXT");
        console.log(ctx.req);
        return "test";
      },
    });
  },
});
