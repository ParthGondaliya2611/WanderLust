const express = require("express");
const router = express.Router();
const Listing = require("../Model/Listing");
const ExpresError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../Schema");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");

//validate listing middleware

const validetListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpresError(400, error);
  } else {
    next();
  }
};

//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./Listings/index.ejs", { allListings });
  })
);

//New Route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//show route
router.get(
  "/:id",
  // isReviewAuthor,
  wrapAsync(async (req, res) => {
    let list = await Listing.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          model: "User", // or whateve  r your user model name is
        },
      })
      .populate("owner");

    if (!list) {
      req.flash("error", "Listing you requested for does not existed! ");
      return res.redirect("/login");
    }
    res.render("./Listings/show.ejs", { list });
  })
);

//create new Listing
router.post(
  "/",
  validetListing,
  wrapAsync(async (req, res) => {
    let { title, description, image, filename, price, location, country } =
      req.body;

    let newlist = await Listing({
      title: title,
      description: description,
      image: {
        url: image,
        filename: filename,
      },
      price: price,
      location: location,
      country: country,
    });

    await newlist.save();

    req.flash("success", "New Listing Created ");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",

  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you requested for does not existed! ");
      return res.redirect("/listings");
    }
    res.render("./Listings/edit.ejs", { list });
  })
);

//update Listing
router.put(
  "/:id",
  isOwner,
  validetListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, filename, price, location, country } =
      req.body;

    let newListing = await Listing.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        image: {
          url: image,
          filename: filename,
        },
        price: price,
        location: location,
        country: country,
      },
      { runValidators: true },
      { new: true }
    );
    res.redirect("/listings");
  })
);

//delete Listing
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
