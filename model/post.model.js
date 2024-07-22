import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },

    description: {
      type: String,

      default:"",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        default: [],
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

export default Post;
