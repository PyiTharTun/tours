const User = require("../models/userModel");
const APIFeatures = require("../utils/APIFeeatures");
const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/nodemailer");

const signtoken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.register = async (req, res) => {
  try {
    const hashedPassord = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassord,
      // passwordConfirm: req.body.passwordConfirm
    });
    // const token = jwt.sign(
    //     {
    //         id:user._id,
    //     },
    //     process.env.JWT_SECRET,
    //     {
    //         expiresIn: process.env.JWT_EXPIRES_IN,
    //     }
    // )
    const token = signtoken(user._id);

    res.status(201).json({
      status: "success",
      message: "User has been created successfully.",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong.",
      error: err,
    });
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Check email and password from the request body
  if (!email || !password) {
    res.status(404).json({
      status: "fail",
      message: "Please Enter email and password",
    });
  }
  //find the user in the database
  // const user = await User.findOne({email : req.body.email});
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) {
    return next(new AppError("User is not registered", 404));
  }
  //check password
  // const correctPassword = await user.correctPassword(password, user.password);
  const match = await bcrypt.compare(req.body.password, user.password);

  // if (!user || !match){
  //     return res.status(201).json({
  //         status: "fail",
  //         message: "User not Found or incorrect passowrd",
  //     })
  // }
  if (match == true) {
    const token = signtoken(user._id);

    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } else {
    return next(new AppError("Invalid Password", 401));
  }
  // check user login password

  // const token = jwt.sign(
  //     {
  //         id:user._id,
  //     },
  //     process.env.JWT_SECRET,
  //     {
  //         expiresIn: process.env.JWT_EXPIRES_IN,
  //     }
  // )
};
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  //   console.log(`>>>>>>${decoded.iat}`);
  //   console.log( Date.now(currentUser.passwordChangeAt));
  if (currentUser.passwordChangeAt) {
    const changeTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    //   console.log(changeTimestamp);
    if (decoded.iat < changeTimestamp) {
      return next(
        new AppError("User recently change password! Please log in again.", 401)
      );
    }
  }
  //   if (currentUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //       new AppError("User recently change password! Please log in again.", 401)
  //     );
  //   }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
// ChagePasswordAfter function

//Role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res) => {
  //1. Get User base on user's email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return new AppError("There is no user with that email", 404);
  }
  // 2. Generate Random access token
  const { resetToken, passwordResetToken, passwordResetExpired } =
    createPasswordResetToken();

  //2.1. Save the token to the database
  await User.findByIdAndUpdate(user._id, {
    // passwordChangeAt: Date.now(),
    passwordResetToken: passwordResetToken,
    passwordResetExpired: passwordResetExpired,
  });
  //3. Send it to user's email
  await sendEmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 minutes)",
    message: `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`,
  });

  return res.status(200).json({
    status: "success",
    resetToken,
    passwordResetToken,
    passwordExpiredIn: passwordResetExpired,
    passwordChangeAt: Date.now(),
  });
});
const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  console.log(resetToken);

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log(`>>>${Date.now()}`);
  const passwordResetExpired = Date.now() + 10 * 60 * 1000;
  //   var time = new Date().getTime(); // get your number
  //   var ExpiredDate = new Date(passwordResetExpired); // create Date object

  // console.log(ExpiredDate); // result: Wed Jan 12 2011 12:42:46 GMT-0800 (PST)
  return { resetToken, passwordResetToken, passwordResetExpired };
};

exports.resetPassword = catchAsync(async (req, res) => {
  // console.log("InNN reset");
  //1. Check the token and get user
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  // 2 if the token is expired or token is invalid, set the new password
  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  // 3. Update changePasswordAt property for the user

  const hashedPassord = await bcrypt.hash(req.body.password, 10);
  // console.log(hashedPassord);
  // const hashedPassordConfirm = await bcrypt.hash(req.body.passwordConfirm, 10);
  // console.log(hashedPassordConfirm);
  user.password = hashedPassord;
  // user.passwordConfirm = hashedPassordConfirm;
  user.passwordChangeAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;

  await user.save(); //

  // 4. Log the user in and send JWT
  const token = signtoken(user._id);

  res.status(200).json({
    status: "success",
    passwordChangeAt: user.passwordChangeAt,
    token,
  });
});

//Update Passowrd
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Find the user in db
  var user = await User.findOne({ email: req.user.email }).select("+password");
  if (!user) {
    return next(new AppError("User is not registered", 404));
  }

  // 2) Check current password
  const match = await bcrypt.compare(req.body.currentPassword, user.password);

  if (match == false) {
    return next(new AppError("Invalid Password", 401));
  }

  // 3) If correct, update the password
  const hashedPassord = await bcrypt.hash(req.body.newPassword, 10);
  user = await User.findByIdAndUpdate(user._id, {
    password: hashedPassord,
    passwordChangeAt: Date.now() - 1000,
  });
  // 4) Log the user in, send JWT
  const token = signtoken(user._id);
  res.status(201).json({
    status: "success",
    user,
    token,
  });

});
