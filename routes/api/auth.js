const router = require("express").Router();
const auth = require("../../middleware/auth");
const User = require("../../models/user");

// @route Get api/auth
// @des Test Route
// @acess Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
