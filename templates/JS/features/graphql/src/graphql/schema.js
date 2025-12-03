export const typeDefs = `#graphql
  type Query {
    hello: String
  }

  type Mutation {
    echo(message: String!): String
  }
`;
