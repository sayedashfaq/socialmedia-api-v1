import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, required: true },
    likes: [],
    comments: [commentSchema],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

var postModel = mongoose.model("posts", postSchema);

export default postModel;
