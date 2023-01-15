import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

// Typescript Definition:
export interface UserInput {
  username: string;
  email: string;
  name: string;
  lastName: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  _doc? : any;
  createAt: Date;
  updateAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

// Schema Definition
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Presaved hook
userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  // If the pass has not been modified.
  if (!user.isModified("password")) {
    return next();
  }

  // Hash the plain text password with salt
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

// Compare the password the user provided with the hash, returns true if they match, false if not.
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

// Model Definition
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
