const express = require("express");
require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
// defining middleware
app.use(express.json());

// Defining Routes

app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/post"));

app.get("/", (req, res) => {
  res.send("HELLO !! API RUNNING");
});

app.listen(PORT, () => {
  console.log(`Backend Started at ${PORT}`);
});
