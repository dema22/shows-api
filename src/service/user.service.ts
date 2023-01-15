import UserModel, { UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    let user = await UserModel.create(input);
    const { password, ...responseUser } = user._doc;
    return responseUser;
  } catch (e: any) {
    throw new Error(e);
  }
}

// Check if the user provided a valid password.
export async function validatePassword({
  email, password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);
  if(!isValid) {
    return false;
  }
  const { pass, ...responseUser } = user._doc;
  return responseUser;
}
