import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Mongoose Hooks
 */
userSchema.pre("save", async function(next){
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next()
});

userSchema.methods.comparePassword = async function (password) {
  const result =  await bcrypt.compare(password, this.password);
  return result
};

const User = mongoose.model("User", userSchema);

export default User;
