import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    username: string({
      required_error: "User Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    name: string({
      required_error: "Name is required",
    }),
    lastName: string({
      required_error: "Last Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 8 chars minimum"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
