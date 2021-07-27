const router = require("express").Router();

// @route Get api/profile
// @des Test Route
// @acess Public

router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
