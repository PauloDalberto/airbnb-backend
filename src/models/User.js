import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: String,
  password: String,
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password; 
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default model('User', UserSchema);
