const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    // unique: true,
    trim: true,
    maxlength: [40, "A tour name must have less or equal then 40 characters"],
    minlength: [4, "A tour name must have more or equal then 4 characters"],
    //   validate: [validator.isAlpha, 'Tour name must only contain characters']
    // validate: {
    //   validator: (val) => validator.isAlpha(val, ["en-US"], { ignore: " " }),
    //   message: "A tour must only  contain characters",
    // },
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    // lowercase:true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password:{
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user'
  },
  passwordChangeAt: {
    type: Date,
    // default:
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpired: {
    type: Date,
  },
  // passwordConfirm:{
  //   type: String,
  //   required: [true, 'Please confirm your password'],
  //   validate: {
  //       validator: function(el){
  //           return el == this.password;
  //       },
  //       message: 'Password are not the same'
  //   }
  // }
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
