const router = require("express").Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const config = require("config");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
const profile = require("../../models/Profile");
const request = require("request");

// @route Get api/profile/me
// @des Get currnent Profile
// @acess Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile For this User" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route Post api/profile/
// @des Create Or Update Profile
// @acess Public

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
    } = req.body;
    // console.log(req.body);
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
      // profileFields.skills = Object.keys(skills).map((skill) => skill.trim());
    }

    // build Social Object;
    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }

    if (twitter) {
      profileFields.social.twitter = twitter;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // console.log(profile.user);
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.messgae);
      res.status(400).send(err.message);
    }
  }
);

// @route get api/profile/
// @des Get All Profiles
// @acess Public

router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find({}).populate("user", ["avatar", "name"]);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route get api/profile/:user_id
// @des Get All Profiles
// @acess Public

router.get("/user/:user_id", async (req, res) => {
  try {
    // const profile = await Profile.find({}).populate("user", ["avatar", "name"]);
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["avatar", "name"]);
    if (!profile) {
      return res.status(400).json({ msg: "No Profile found" });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route Delete api/profile/
// @des Delete Profile user post
// @acess Private

router.delete("/", auth, async (req, res) => {
  try {
    // remove profile
    const profile = await Profile.findOneAndRemove({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile Doesnt exist" });
    }
    // remove User
    const user = await User.findByIdAndRemove(req.user.id);
    res.json({ msg: "User Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route put api/profile/experience
// @des add Profile profule experience
// @acess Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title").not().isEmpty(),
      // check("company", "Company Field is required").isEmpty(),
      check("title", "Title is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(404).json({ errors: errors.array() });
      }

      const { title, company, location, from, current, description } = req.body;
      const newExp = {
        title,
        company,
        location,
        from,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: err.message });
      }
    }
  }
);

// @route put api/profile/experience
// @des add Profile profule experience
// @acess Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter((item) => {
      item.id != req.params.exp_id;
    });
    await profile.save();
    res.send(profile);
  } catch (err) {}
});

// @route put api/profile/eductaion
// @des add profile Education
// @acess Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      // check("company", "Company Field is required").isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
      // check("fieldofstudy", "Field of study Required").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(404).json({ errors: errors.array() });
      }

      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
      }
    }
  }
);

// @route put api/profile/education
// @des add Profile profule education
// @acess Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education = profile.education.filter((item) => {
      item.id != req.params.edu_id;
    });
    await profile.save();
    res.send(profile);
  } catch (err) {}
});

// @route Get api/profile/github/:username
// @des get User repos
// @acess Public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "ClientId"
      )}&client_secret=${config.get("ClientSecret")}`,

      method: "GET",

      headers: { "user-agent": "nodejs" },
    };

    request(options, (err, response, body) => {
      if (err) {
        console.error(err.message);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Git hub Profile Found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
