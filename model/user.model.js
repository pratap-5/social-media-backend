import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
       
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    profilePicPath: {
      type: String,
      required: true,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        default: [],
      },
    ],

    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        default: [],
      },
    ],

    blocks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        default: [],
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
