const Review = require("../Model/Review");
const Listing = require("../Model/Listing");

const ReviewController = {
  createReview: async (req, res) => {
    let { id } = req.params;
    let { comment, rating } = req.body;

    let listing = await Listing.findById(id);
    let newReview = new Review({ comment: comment, rating: rating });

    newReview.author = res.locals.currUser._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    res.redirect(`/listings/${id}`);
  },
  deleteReview: async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  },
};

module.exports = ReviewController;
