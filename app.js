const express = require("express");
const app = express();
const tourRouter = require("./routers/tourRoute")
const userRouter = require("./routers/userRoute")
const requestTime = require("./middlewares/reqTime")
const cors = require("cors");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorCtrl");

app.use(express.json());
app.use(cors());

// const port = 3000;
const myLogger = (req, res, next)=>{
  console.log("Hello From Server middle ");
  next()
}


// app.get("/api/v1/tours/:id/:test/:halo?",(req,res)=>{
//patch method
// delect method
  // if(idinfo.data){
  //     idinfo = "id not found"
  //     console.log("KKKKKKK")
  // }


  //     var orderInfo = orders.map( function(order) {
  //  if( order.status === "delivered"){
  //      var info = { "orderName": order.name,
  //                   "orderDesc": order.description
  //                  }
  //      return info;
  //  }
  const healthcheck = (req, res) => {
    res.end("Hellow from Express");
  }

app.get("/", healthcheck);  
app.use(myLogger);
app.use(requestTime);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users",userRouter);
// app.use("/api/v1/users/login",userRouter);
// app.listen(port, () => {
//   console.log(`App is runing on port ${port}`);
// });
// HANDLE unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server.`,
  // });
});

app.use(GlobalErrorHandler);

module.exports = app;