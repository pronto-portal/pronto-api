import { inputObjectType } from "nexus";

export const Paginated = inputObjectType({
  name: "PaginatedInput",
  definition(t) {
    t.nonNull.int("page");
    t.nonNull.int("countPerPage");
  },
});
