const express = require("express");
require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// geting  Routes
const userRoutes = require("./routes/api/user");
const authRoutes = require("./routes/api/auth");
const profileRoutes = require("./routes/api/profile");
const postRoutes = require("./routes/api/post");

// Defining Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("HELLO !! API RUNNING");
});

app.listen(PORT, () => {
  console.log(`Backend Started at ${PORT}`);
});
