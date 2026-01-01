import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

// Import User Module
import { userTypeDefs } from './module/user/user.schema.js';
import { userResolvers } from './module/user/user.resolver.js';

// Import Todo Module
import { todoTypeDefs } from './module/todo/todo.schema.js';
import { todoResolvers } from './module/todo/todo.resolver.js';

// Merge TypeDefs
export const typeDefs = mergeTypeDefs([
    userTypeDefs, 
    todoTypeDefs
]);

// Merge Resolvers
export const resolvers = mergeResolvers([
    userResolvers, 
    todoResolvers
]);