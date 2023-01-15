import mongoose from "mongoose";
import { UserDocument } from "./user.model";

// Typescript Definition:
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"],
  valid: boolean;
  userAgent: string;
  createAt: Date;
  updateAt: Date;
}

// Schema Definition
const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true},
    userAgent: {type: String},
  },
  {
    timestamps: true,
  }
);

// Model Definition
const SessionModel = mongoose.model<SessionDocument>("SessionModel", sessionSchema);
export default SessionModel;
