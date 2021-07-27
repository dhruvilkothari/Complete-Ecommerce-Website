const router = require("express").Router();

// @route Get api/users
// @des Test Route
// @acess Public

router.get("/", (req, res) => {
  res.send("User Route");
});

module.exports = router;
