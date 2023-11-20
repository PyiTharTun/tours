const express = require("express");
const tourRouter = express.Router();
const tourCtrl = require("../controllers/tourCtrl");
const authController = require("../controllers/authCtrl");

tourRouter
  .route("/")
  .get(authController.protect, tourCtrl.getAllTours)
  .post(tourCtrl.addOneTour)
  .delete(tourCtrl.deleteAllTours);
// app.post("/api/v1/tours",updateOneTour)
// app.get("/api/v1/tours", getAllTours)
// app.path("/:id", updatedTours);
// app.delete("/:id", deleteTour);

tourRouter
  .route("/top-5-cheap")
  .get(tourCtrl.aliasTopTour, tourCtrl.getAllTours);

tourRouter
  .route("/:tourid")
  .get(tourCtrl.getOneTour)
  .patch(tourCtrl.updatedTours)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "user"),
    tourCtrl.deleteTour
  );
// tourRouter.param("id",tourCtrl.checkID);
module.exports = tourRouter;
