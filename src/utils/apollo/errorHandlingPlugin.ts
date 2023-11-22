import { ApolloServerPlugin, BaseContext } from "@apollo/server";
import { GraphQLRequestContextDidEncounterErrors } from "@apollo/server";

const errorHandlingPlugin: ApolloServerPlugin<BaseContext> = {
  async requestDidStart() {
    return {
      async didEncounterErrors(
        requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>
      ) {
        if (requestContext.response && requestContext.errors) {
          for (const error of requestContext.errors) {
            if (error.message === "unauthorized") {
              requestContext.response.http.status = 401;
              break;
            }
          }
        }
      },
    };
  },
};

export default errorHandlingPlugin;
