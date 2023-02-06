import { objectType } from "nexus";
import { User } from "nexus-prisma";

const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.createdAt);
    t.field(User.updatedAt);
    t.field(User.email);
    t.field(User.phone);
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(User.profilePic);
    t.field(User.isManager);
    t.field(User.isTranslator);
    t.field(User.isBanned);
    t.field(User.assignments);
    t.field(User.assignedTo);
  },
});

export default UserType;
