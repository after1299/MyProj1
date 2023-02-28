const router = require("express").Router();
const Post = require("../models").postModel;
const postValidation = require("../validation").postValidation;

// middleware
router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .populate("poster", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Cannot get post.");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Post.findOne({ _id })
    .populate("poster", ["username", "email"])
    .then((post) => {
      res.send(post);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  // validate the inputs before making a new post.
  const { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { title, content } = req.body;
  if (!req.user.isMember()) {
    return res.status(400).send("Please login to post.");
  }
  let newPost = new Post({
    title,
    content,
    poster: req.user._id,
  });
  try {
    await newPost.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

router.patch("/:_id", async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { _id } = req.params;
  let post = await Post.findOne({ _id });
  if (!post) {
    res.status(404);
    return res.json({
      success: false,
      message: "Post not found.",
    });
  }
  if (post.poster.equals(req.user._id) || req.user.isAdmin) {
    Post.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only the poster of this post can edit this post.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let post = await Post.findOne({ _id });
  if (!post) {
    res.status(404);
    return res.json({
      success: false,
      message: "Post not found.",
    });
  }
  if (post.poster.equals(req.user._id) || req.user.isAdmin) {
    Post.findOneAndDelete({ _id })
      .then(() => {
        res.send("Course deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only the poster of this post can delete this post.",
    });
  }
});

module.exports = router;
