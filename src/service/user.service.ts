import UserModel, { UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    let user = await UserModel.create(input);
    /*const { password, ...responseUser } = user._doc;
    return responseUser;*/
    return user;
  } catch (e: any) {
    throw new Error(e);
  }
}
