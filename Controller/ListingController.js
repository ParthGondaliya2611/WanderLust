// const { isLoggedIn } = require("../middleware");
const Listing = require("../Model/Listing");

const ListingController = {
  index: async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./Listings/index.ejs", { allListings });
  },

  loginPage: async (req, res) => {
    res.render("listings/new.ejs");
  },

  singleListting: async (req, res) => {
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
  },

  createListing: async (req, res) => {
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

    console.log(newlist);

    req.flash("success", "New Listing Created ");
    res.redirect("/listings");
  },

  editListingPage: async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you requested for does not existed! ");
      return res.redirect("/listings");
    }
    res.render("./Listings/edit.ejs", { list });
  },

  updateListing: async (req, res) => {
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
  },

  deleteListing: async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  },
};

module.exports = ListingController;
