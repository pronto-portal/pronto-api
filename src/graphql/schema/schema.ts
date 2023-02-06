import { makeSchema } from "nexus";
import AddressType from "../types/Address";
import AssignmentType from "../types/Assignment";
import ClaimantType from "../types/Claimant";
import UserType from "../types/User";

const schema = makeSchema({
  types: [UserType, AssignmentType, AddressType, ClaimantType],
});

export default schema;
