import postModel from "../models/post.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";

// creating a post
// export const createPost = async (req, res) => {
//   const newPost = new postModel(req.body);

//   try {
//     await newPost.save();
//     res.status(200).json(newPost);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// Assuming 'upload' is your multer middleware configured for file uploads



// get a post
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await postModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await postModel.find({ userId: userId });

    const followingPosts = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  const postId = req.params.id;
  const { userId, text } = req.body;

  try {
    const post = await postModel.findById(postId);
    const comment = { text, userId };
    post.comments.push(comment);
    await post.save();
    res.status(200).json("Comment added");
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { userId, text } = req.body;

  try {
    const post = await postModel.findById(postId);
    const comment = post.comments.id(commentId);
    if (comment.userId === userId) {
      comment.text = text;
      await post.save();
      res.status(200).json("Comment updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    const comment = post.comments.id(commentId);
    if (comment.userId === userId || post.userId === userId) {
      await comment.remove();
      await post.save();
      res.status(200).json("Comment deleted");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all comments for a post
export const getComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await postModel.findById(postId, "comments");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json(error);
  }
};
