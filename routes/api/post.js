const router = require("express").Router();

// @route Get api/post
// @des Test Route
// @acess Public

router.get("/", (req, res) => {
  res.send("Post Route");
});

module.exports = router;
