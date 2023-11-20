// const fs = require("fs");
// const data = fs.readFileSync(`${__dirname}/../data/tours-simple.json`, "utf-8");
// const tours = JSON.parse(data);
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/APIFeeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // res.status(200).json({
  //   status: "success",
  //   tours: tours,
  // });
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const tours = await features.query;

    //1. filtering
    //   console.log(req.query);
    //   //1.1 remove unwanted Query e.g page , sort , limit , fields
    //   const qureyObj = {...req.query};
    //   const excludeFields = ["page", "sort", "limit", "fields"];
    //   excludeFields.forEach((el)=>delete qureyObj[el]);
    //   console.log(qureyObj);
    // // 1.2 Advance Filtering
    // let queryStr = JSON.stringify(qureyObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
    // console.log(queryStr);
    // //query build => Select * from tours where duration = 5
    // let query = Tour.find(JSON.parse(queryStr));
    // // 2. sorting
    // if (req.query.sort){
    //   console.log(">>>>>>");
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);//query => Select * from tours where order by price
    //   console.log("<<<<<<")
    // } else{
    //   query = query.sort('-createdAt');
    // }
    // //3. Field Limiting
    // if (req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else{
    //   //3.1 Default Field Limiting
    //   query = query.select('-__v');
    // }

    // //4. Pagination

    // const page = req.query.page*1 || 1; //page = 1, 2
    // const limit = req.query.limit * 1 || 10; // limit = 10
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
    //execute query
    // const tours = await query;
    // console.log(tours);
    res.status(200).json({
      status: "success",
      requestAt: req.requestTime,
      result: tours.length,
      tours,
    });
  
});
exports.getOneTour = async (req, res) => {
  // const id = req.params.id;
  // var tour = tours.find((el) => el.id == id); //filter return empty array if empty
  // if (!tour) {
  //   return res.status(200).json({
  //     status: "success",
  //     tours: "The tour does not exist.",
  //   });
  // }
  // res.status(200).json({
  //   status: "successs",
  //   // tours : tours[id], call with index
  //   // tours: idSearch(id), call with function
  //   tour,
  //   requestTime: req.requestTime,
  // });
  try {
    const tour = await Tour.findById(req.params.tourid);
    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Cannot find the ID.",
    });
  }
};
exports.addOneTour = async (req, res) => {
  console.log(req.body);
  // const newTour = req.body;
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/../data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     if (err) {
  //       return res.status(500).json({
  //         status: "fail",
  //         message: "Something went wrong when adding data to database",
  //       });
  //     }
  //     return res.status(200).json({
  //       status: "succeess",
  //       message: "Successfully added a tour to database",
  //       tour: newTour,
  //     });
  //   }
  // );
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Tour has been added successfully",
      tour: newTour,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "fail",
      message: `${err.message}${err.name}`,
    });
  }
};
exports.deleteTour = async (req, res) => {
  // console.log("delecting ......");
  // const id = req.params.id;
  // // tours.find((el) => el.id == id);
  // tourindex = tours.findIndex((el) => el.id == id);
  // console.log(tourindex);
  // console.log(tours[tourindex]);
  // // if (tourindex== -1) {
  // if (!tours[tourindex]) {
  //   return res.status(200).json({
  //     status: "fail",
  //     tours: "The tour does not exist.",
  //   });
  // }
  // // delete tours.tourindex;
  // const removedtour = tours.splice(tourindex,1)
  // // console.log(removedtour);

  // fs.writeFile(
  //   `${__dirname}/../data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     if (err) {
  //       return res.status(500).json({
  //         status: "fail",
  //         message: "Something went wrong when delecting data to database",
  //       });
  //     }
  //     res.status(200).json({
  //       status: "success",
  //       delectedtour: removedtour,
  //       message: `The above tour ID ${id} has been delected successfully`,
  //     });
  //   }
  // );
  //>>>> rewrite with mongoose
  try {
    const id = req.params.tourid;
    const tour = await Tour.findById(id);
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: `Your id ${id} is successfully deleted.`,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "success",
      message: "Something went wrong when deleting the data.",
      error: err,
    });
  }
};
exports.updatedTours = async (req, res) => {
  // const id = req.params.id;
  // var tour = tours.find((el) => el.id == id);

  // var newTour = {
  //   duration: req.body.duration,
  // };
  // res.status(200).json({
  //   status: "success",
  //   message: "Tour has been updated successfully",
  //   tours: newTour,
  // });

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.tourid, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteAllTours = async (req, res, next) => {
  // tours.splice(0);
  // console.log(`${tours}>>>>*****`);
  // fs.writeFile(`${__dirname}/../data/tours.json`,JSON.stringify(tours),
  // (err)=>{
  //   if (err){
  //     console.log("in fail???????")
  //     return res.status(500).json({
  //       status: "fail",
  //       message: "Something went wrong while deleting all data",

  //     });
  //   }
  //   console.log("in success______")
  //   return res.status(200).json({
  //     status: "success",
  //     message: "All records are deleted."
  //   })
  // })
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
    res.status(200).json({
      status: "success",
      message: "All Tour has been added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "Something went wrong while deleting all data.",
    });
  }
  next();
};

exports.checkID = (req, res, next, val) => {
  // console.log(`Tour id is ${val}`);
  // if(req.params.id *1 > tours.length){
  //     return res.status(404).json({
  //         status: "fail",
  //         message: "Invalid ID"
  //     })
  // }
  next();
};

exports.checkbody = (req, res, next) => {
  // console.log ("This is checkbody middle ware,,,,,");
  // // console.log(req.body);
  // if (!req.body){
  //   return res.status(400).json({
  //     status: "fail",
  //   })
  // }
  next();
};
