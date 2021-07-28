const mongoose = require("mongoose");
const config = require("config");
console.log(config.get("mongoURI"));
mongoose.connect(
  config.get("mongoURI"),
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("backend connected");
  }
);
