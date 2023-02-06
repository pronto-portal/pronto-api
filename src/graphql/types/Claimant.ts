import { objectType } from "nexus";
import { Claimant } from "nexus-prisma";

const ClaimantType = objectType({
  name: Claimant.$name,
  description: Claimant.$description,
  definition(t) {
    t.field(Claimant.id);
    t.field(Claimant.firstName);
    t.field(Claimant.lastName);
    t.field(Claimant.email);
    t.field(Claimant.assignment);
  },
});

export default ClaimantType;
