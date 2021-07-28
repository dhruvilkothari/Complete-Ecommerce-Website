const router = require("express").Router();
const User = require("../../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

// @route POST api/users
// @des  Register User
// @acess Public

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("name", "Name is required").not().isEmpty(),
    check("password", "Please Enter A Correct Password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // SEE IF USer EXIST
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User with email already exists",
            },
          ],
        });
      }
      // Get Users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        email,
        password,
        name,
        avatar,
      });

      // hash password
      const hashPassword = await bcrypt.hash(password, 12);
      user.password = hashPassword;

      await user.save();
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
