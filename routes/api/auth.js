const router = require("express").Router();
const auth = require("../../middleware/auth");
const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

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

// @route POST api/auth
// @des  Authenticate user and get token
// @acess Public

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required ").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // SEE IF USer EXIST
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User Doesnt exist",
            },
          ],
        });
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res
          .status(400)
          .json({ msg: "Please Enter Correct Credentials" });
      }
      // send jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(
        payload,
        config.get("jwtSecretKey"),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.json({ token: token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }

    // res.status(200).send("Done");
  }
);

module.exports = router;
