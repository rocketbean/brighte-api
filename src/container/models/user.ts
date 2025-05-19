import Model from "../../package/statics/Model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  mobile: string;
  email: string;
  postcode?: String;
}

export interface UserModel extends mongoose.Model<UserInterface> {
  findByCredentials(email: string, pass: string): UserInterface;
}

var userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  mobile: {
    type: String,
    required: true,
    trim: true,
  },

  alias: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  postcode: {
    type: String,
    trim: true,
  },
});

const User = Model.connect<UserModel>("user", userSchema);
export type ModelType = UserModel;
export default User as UserModel;
