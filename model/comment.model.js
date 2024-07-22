import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },

  msg: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
