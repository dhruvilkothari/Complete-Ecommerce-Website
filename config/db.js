const mongoose = require("mongoose");
const config = require("config");
console.log(config.get("mongoURI"));
mongoose.connect(
  config.get("mongoURI"),
  {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("backend connected");
  }
);
