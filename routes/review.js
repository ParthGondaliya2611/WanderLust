const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../Model/Listing");
const Review = require("../Model/Review");
const ExpresError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../Schema");
const { isReviewAuthor } = require("../middleware");
const ReviewController = require("../Controller/ReviewController");

const validateRating = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpresError(400, error);
  } else {
    next();
  }
};

//Ratings create
router.post(
  "/reviews",
  validateRating,
  wrapAsync(ReviewController.createReview)
);

//Delete the Review
router.delete(
  "/reviews/:reviewId",
  isReviewAuthor,
  wrapAsync(ReviewController.deleteReview)
);

module.exports = router;
