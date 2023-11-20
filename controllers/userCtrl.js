// const fs = require("fs");
// const data = fs.readFileSync(`${__dirname}/../data/users.json`, "utf-8");
// const users = JSON.parse(data);
const User = require("../models/userModel");



exports.getallUser = async (req, res, next) => {
  try{
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      users,
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};
exports.getOneUser = (req, res) => {
  const id = req.params.id;
  var user = users.find((el) => el._id == id); //filter return empty array if empty
  if (!user) {
    return res.status(200).json({
      status: "success",
      users: "The user does not exist.",
    });
  }
  res.status(200).json({
    status: "successs",
    user,
  });
};
exports.registerUser = (req, res) => {
  console.log(req.body.email);
  var user = users.find((el) => el.email == req.body.email);
  if (user){
    return res.status(400).json({
        status: "fail",
        message: "The user already exists."
    })
  }
  const newUser = req.body;
  users.push(newUser);

  fs.writeFile(
    `${__dirname}/../data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Something went wrong when adding data to database",
        });
      }
      return res.status(200).json({
        status: "succeess",
        message: "Successfully added a user to database",
        user: newUser,
      });
    }
  );
};
///////////// here 
exports.deleteOneUser = async (req, res) => {
  const id = req.params.id;
  const users = await User.findByIdAndDelete(id);
  // userindex = users.findIndex((el) => el._id == id);
  // if (!users[userindex]) {
  //   return res.status(200).json({
  //     status: "fail",
  //     users: "The user does not exist.",
  //   });
  // }
  // const removeduser = users.splice(userindex,1)
  // fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),
  // (err)=>{
  //   if (err){
  //     return res.status(400).json({
  //       status: "fail",
  //       users: "The user does not exist.",
  //   })
  // }
  // res.status(200).json({
  //   status: "success",
  //   user: removeduser,
  //   message: "The User has been deleted successfully",
  // })
  // })
}

exports.updatedUser = (req, res) => {
  const id = req.params.id;
  var user = users.find((el) => el.id == id);

  var newUser = {
    duration: req.body.duration,
  };
  res.status(200).json({
    status: "success",
    message: "User has been updated successfully",
    user: newUser,
  })
}
exports.deleteAllUser = (req, res )=>{
  
}
exports.checkbody = (req,res, next)=>{
 console.log(!req.body.password);
 if (!req.body.email || !req.body.password){
  return res.status(400).json({
    status: "fail",
    message: "Your Data is empthy",
  })
 }
 next();
}
exports.loginUser=(req, res )=>{
  console.log(req.body.email);
  // var userEmail = req.body.email;
  var userInputPassword = req.body.password;
  var user = users.find((el) => el.email == req.body.email);
  if (!user || user.password !=userInputPassword){
    return res.status(400).json({
      status: "fail",
      message: "Login Fail<< incorrect passord or Wrong Email"
    })
  }
  
  // const loginData = req.params.body;
  // console.log(loginData);
  res.status(200).json({
    status: "success",
    message: "Happy Login",
  })
}
exports.checkUsrID = (req,res,next,val)=>{
  console.log(`User id is ${val}`);
  var user = users.find((el) => el._id == val); 
  if(!user){
      return res.status(404).json({
          status: "fail",
          message: "Invalid User ID"
      })
  }
  next();
}