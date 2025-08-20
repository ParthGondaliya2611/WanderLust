const Listing = require("./Model/Listing");
const Review = require("./Model/Review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must me logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");

  if (!res.locals.currUser._id === listing.owner._id) {
    req.flash("Error", "You dont have permission to edit listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (res?.locals?.currUser?.equals(review.author)) {
    req.flash("error", "You  are not author to delete");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
