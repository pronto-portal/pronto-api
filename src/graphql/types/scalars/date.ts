import { asNexusMethod } from "nexus";
import { DateTimeResolver } from "graphql-scalars";

export const DateTimeScalar = asNexusMethod(DateTimeResolver, "date");
