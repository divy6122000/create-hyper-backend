import { GraphQLError } from "graphql";
import { User } from "../../../models/user.model.js";
import { userLoginSchema, userRegisterSchema, userUpdateSchema } from "./user.validator.js";
import { AuthService } from "../../../services/auth.service.js";

export const userResolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { _id }) => await User.findById(_id),
  },
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        userLoginSchema.parse({ email, password });
        const { user, token } = await AuthService.login({ email, password });
        return { success: true, user, token };
      } catch (error) {
        console.error('Login error:', error);
        if (error.name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: error.flatten().fieldErrors,
            },
          });
        }
        throw error;
      }
    },
    register: async (_, { firstName, lastName, email, password, confirmPassword }) => {
      try {
        userRegisterSchema.parse({ firstName, lastName, email, password, confirmPassword });
        const user = new User({ firstName, lastName, email, password });
        return await user.save();
      } catch (error) {
        if (error.name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: error.flatten().fieldErrors,
            },
          });
        }
        throw error;
      }
    },
  }
};