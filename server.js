const app = require("./app");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");


dotenv.config({ path: "./config.env" });
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "development") {
  app.use(morgan("tiny"));
  console.log("Here....Development");
}

var mongoUrl = `mongodb+srv://pyithartun:${process.env.DB_pw}@newmornietours.nejsm2t.mongodb.net/MornieTours?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl).then((con) => {
  // console.log(con.connection);
  console.log("Mongo connect successful");
});


//Data Object



const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
