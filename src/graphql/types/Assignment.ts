import { objectType } from "nexus";
import { Assignment } from "nexus-prisma";

const AssignmentType = objectType({
  name: Assignment.$name,
  description: Assignment.$description,
  definition(t) {
    t.field(Assignment.id);
    t.field(Assignment.createdAt);
    t.field(Assignment.assignedTo);
    t.field(Assignment.createdBy);
    t.field(Assignment.claimant);
    t.field(Assignment.address);
    t.field(Assignment.isComplete);
    t.field(Assignment.claimantNoShow);
    t.field(Assignment.translatorNoShow);
  },
});

export default AssignmentType;
