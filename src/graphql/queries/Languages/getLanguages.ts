import { extendType, list } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { Translate } from "../../../utils/helper/googleTranslate";

export const getLanguages = extendType({
  type: "Query",
  definition(t) {
    t.field("getLanguages", {
      type: list("Language"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx, "basic"),
      async resolve(_root, _args) {
        const [languages] = await Translate.getLanguages();
        return languages;
      },
    });
  },
});
