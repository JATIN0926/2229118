import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 3000;

const baseUrl = process.env.TEST_SERVER_BASE_URL;

const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error in fetching the data from ${endpoint}:,error.message`);
    throw error;
  }
};

app.get("/users", async (req, res) => {
  try {
    const userData = await fetchData("/users");
    const postsData = await fetchData("/users/1/posts");
    const userPostCounts = {};
    postsData.posts.forEach((post) => {
      userPostCounts[post.userId] = (userPostCounts[post.userId] || 0) + 1;
    });

    const topUsers = Object.entries(userPostCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId]) => userData.users[userId]);

    res.json({ topUsers });
  } catch (error) {
    res.status(500).json({ error: "Error in fething top Users" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || !["popular", "latest"].includes(type)) {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const postsData = await fetchData("/users/1/posts");
    const commentsData = await fetchData("posts/150/comments");

    if (type == "popular") {
      const postCommentCounts = {};
      commentsData.comments.forEach((comment) => {
        postCommentCounts[comment.postId] =
          (postCommentCounts[comment.postId] || 0) + 1;
      });
      const popularPosts = postsData.posts.sort(
        (a, b) =>
          (postCommentCounts[b.id] || 0) - (postCommentCounts[a.id] || 0)
      );
      res.json({ popularPosts });
    } else if (type == "latest") {
      const latestPosts = postsData.posts.sort((a, b) => b.id - a.id);
      res.json({ latestPosts });
    }
  } catch (error) {
    res.status(500) / json({ error: "Failed to fetch the posts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
