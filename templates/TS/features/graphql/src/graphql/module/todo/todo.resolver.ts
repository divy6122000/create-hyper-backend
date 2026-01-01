
import { Todo } from "../../../models/todo.model.ts";
import { createTodoSchema, updateTodoSchema } from "./todo.validator.ts";
import { GraphQLError } from "graphql";

export const todoResolvers = {
  Query: {
    todos: async () => await Todo.find(),
    todo: async (_: any, { _id }: { _id: string }) => await Todo.findById(_id),
  },
  Mutation: {
    createTodo: async (_: any, { title, description, completed }: { title: string; description?: string; completed: boolean }) => {
      try {
        createTodoSchema.parse({ title, description, completed });
        const todo = new Todo({ title, description, completed });
        return await todo.save();
      } catch (error: any) {
        if (error.name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: error.flatten().fieldErrors,
            },
          });
        }
        throw new Error('Failed to create todo');
      }
    },
    updateTodo: async (_: any, { _id, title, description, completed }: { _id: string; title?: string; description?: string; completed?: boolean }) => {
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;
      try {
        updateTodoSchema.parse({ title, description, completed });
        return await Todo.findByIdAndUpdate(_id, updateData, { new: true });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: error.flatten().fieldErrors,
            },
          });
        }
        throw new Error('Failed to update todo');
      }
    },
    deleteTodo: async (_: any, { _id }: { _id: string }) => {
      try {
        const todo = await Todo.findById(_id);
        if (!todo) {
          throw new GraphQLError('Todo not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }
        await Todo.findByIdAndDelete(_id);
        return true;
      } catch (error: any) {
        if (error.name === 'ZodError') {
          throw new GraphQLError('Validation Failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              errors: error.flatten().fieldErrors,
            },
          });
        }
        throw new Error('Failed to delete todo');
      }
    },
  },
};