import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String!
    createdAt: String
  }
  type LoginUser{
    _id: ID!
    firstName: String
    lastName: String
    email: String!
  }  

  type Query {
    users: [User]
    user(_id: ID!): User
  }
  
  type Mutation {
    login(email: String!, password: String!): LoginResponse
    register(firstName: String!, lastName: String!, email: String!, password: String!, confirmPassword: String!): User
  }
  
  type LoginResponse {
    success: Boolean!
    token: String!
    user: LoginUser
  }
`;