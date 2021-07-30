const router = require("express").Router();
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

// @route Post api/post
// @des Create Post
// @acess Private

router.post(
  "/",
  [auth, check("text", "Text Is Required").not().isEmpty()],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      return res.status(200).json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route Get api/post
// @des Get all  Post
// @acess Private
router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    if (!post) {
      return res.status(400).json({ msg: "There are no posts" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route Get api/post/:id
// @des Get all  Post
// @acess Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "There are no posts" });
    }
    if (post.user.toString() != req.user.id) {
      return res.status(404).json({ msg: "You cannot Delete post of others" });
    }
    await post.remove();
    res.json({
      msg: "Post Removed",
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "OBbjectId") {
      return res.status(404).json({ msg: "Page Not Found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route Delete api/post/:id
// @des Get all  Post
// @acess Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "There are no posts" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "OBbjectId") {
      return res.status(404).json({ msg: "Page Not Found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route put  api/post/like/:id
// @des Like a post
// @acess Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "There is no posts" });
    }
    // console.log(post);
    // check if post is already like this post
    let isThere = undefined;
    isThere = post.likes.filter((item) => {
      // console.log(item);
      return item.user.toString() === req.user.id;
    });
    // console.log(isThere);
    if (isThere.length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({
      user: req.user.id,
    });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route put  api/post/unlike /:id
// @des Like a post
// @acess Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "There is No such Post" });
    }
    const index = post.likes.findIndex((item) => {
      return item.user.toString() === req.user.id.toString();
    });
    if (index === -1) {
      return res.status(404).json({ msg: "Post has been liked yet" });
    }
    post.likes.splice(index, 1);
    await post.save();
    return res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route Post api/posts/comment/:id
// @des Create on a post
// @acess Private

router.post(
  "/comment/:id",
  [auth, check("text", "Text Is Required").not().isEmpty()],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      return res.status(200).json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
