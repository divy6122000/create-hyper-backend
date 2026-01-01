import { GraphQLError } from "graphql";
import { User } from "../../../models/user.model.ts";
import { userLoginSchema, userRegisterSchema, userUpdateSchema } from "./user.validator.ts";
import { AuthService } from "../../../services/auth.service.ts";

export const userResolvers = {
  Query: {
    users: async (): Promise<any[]> => await User.find(),
    user: async (_: unknown, { _id }: { _id: string }): Promise<any | null> => await User.findById(_id),
  },
  Mutation: {
    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      try {
        userLoginSchema.parse({ email, password });
        const { user, token } = await AuthService.login({ email, password });
        return { success: true, user, token };
      } catch (error: unknown) {
        console.error('Login error:', error);
        if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: (error as any).flatten().fieldErrors as Record<string, string[]>,
            },
          });
        }
        throw error;
      }
    },
    register: async (_: unknown, { firstName, lastName, email, password, confirmPassword }: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string }): Promise<any> => {
      try {
        userRegisterSchema.parse({ firstName, lastName, email, password, confirmPassword });
        const user = new User({ firstName, lastName, email, password });
        return await user.save();
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: (error as any).flatten().fieldErrors as Record<string, string[]>,
            },
          });
        }
        throw error;
      }
    },
  }
};