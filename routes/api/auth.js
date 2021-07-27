const router = require("express").Router();

// @route Get api/auth
// @des Test Route
// @acess Public

router.get("/", (req, res) => {
  res.send("auth Route");
});

module.exports = router;
