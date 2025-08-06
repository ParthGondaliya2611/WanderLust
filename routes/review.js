const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../Model/Listing");
const Review = require("../Model/Review");
const ExpresError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../Schema");
const { isReviewAuthor } = require("../middleware");

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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { comment, rating } = req.body;

    let listing = await Listing.findById(id);
    let newReview = new Review({ comment: comment, rating: rating });

    newReview.author = res.locals.currUser._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    res.redirect(`/listings/${id}`);
  })
);

//Delete the Review
router.delete(
  "/reviews/:reviewId",
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
