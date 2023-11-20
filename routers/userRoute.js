const express = require("express");
const userRouter = express.Router();
const userCtrl = require("../controllers/userCtrl");
const authController = require('./../controllers/authCtrl');
userRouter.route("/").get(userCtrl.getallUser).post(userCtrl.registerUser).delete(userCtrl.deleteAllUser);

// authController.protect, 

userRouter.route("/register").post(authController.register);

userRouter.post('/forgotpassword', authController.forgotPassword);
userRouter.post('/resetpassword/:token', authController.resetPassword);
userRouter.post('/updatepassword',authController.protect, authController.updatePassword);
// userRouter.route("/login").post(userCtrl.checkbody,userCtrl.loginUser)
// userRouter.route("/login").post(authController.login);
userRouter.post('/login', authController.login);
// userRouter.param("id",userCtrl.checkUsrID);
userRouter.route("/:id").get(userCtrl.getOneUser).patch(userCtrl.updatedUser).delete(userCtrl.deleteOneUser).post(userCtrl.loginUser);
module.exports = userRouter;