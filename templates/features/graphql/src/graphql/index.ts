import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

export const createApolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    return expressMiddleware(server);
};
