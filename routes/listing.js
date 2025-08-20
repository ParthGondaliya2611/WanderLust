const express = require("express");
const router = express.Router();
const Listing = require("../Model/Listing");
const ExpresError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../Schema");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const ListingController = require("../Controller/ListingController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

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
router.get("/", wrapAsync(ListingController.index));

//New Route
router.get("/new", isLoggedIn, wrapAsync(ListingController.loginPage));

//show route
router.get(
  "/:id",
  // isReviewAuthor,
  wrapAsync(ListingController.singleListting)
);

//create new Listing
router.post(
  "/",
  upload.single("image"),
  (req, res) => {
    res.send(req.files);
  }
  // validetListing,
  // wrapAsync(ListingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",

  isLoggedIn,
  wrapAsync(ListingController.editListingPage)
);

//update Listing
router.put(
  "/:id",
  isOwner,
  validetListing,
  wrapAsync(ListingController.updateListing)
);

//delete Listing
router.delete("/:id", isLoggedIn, wrapAsync(ListingController.deleteListing));

module.exports = router;
