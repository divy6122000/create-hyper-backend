import { gql } from 'graphql-tag';

export const todoTypeDefs = gql`
  type Todo {
    _id: ID!
    title: String!
    description: String
    completed: Boolean!
  }

  type Query {
    todos: [Todo]
    todo(_id: ID!): Todo
  }
  
  type Mutation {
    createTodo(title: String!, description: String, completed: Boolean!): Todo
    updateTodo(_id: ID!, title: String, description: String, completed: Boolean): Todo
    deleteTodo(_id: ID!): Boolean
  }  
`;