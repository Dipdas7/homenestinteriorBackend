const express = require("express");
const Blog = require("../models/Blog");
const upload = require("../utils/multer");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// Admin Only
router.post("/", auth, upload.single("image"), async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    image: req.file ? req.file.filename : null,
    author: req.admin.email
  });

  await blog.save();
  res.json(blog);
});

router.delete("/:id", auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
});

module.exports = router;
