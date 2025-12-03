export const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL!',
    },
    Mutation: {
        echo: (_: any, { message }: { message: string }) => `Echo: ${message}`,
    },
};
