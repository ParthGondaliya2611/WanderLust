const express = require("express");
const app = express();
const path = require("path");
const Listing = require("./Model/Listing");
const connectdb = require("./connectDB");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


//index route
app.get("/listing", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./Listings/index.ejs", { allListings });
});

//show route
app.get("/listing/:id", async (req, res) => {
  let list = await Listing.findById(req.params.id);
  res.render("./Listings/show.ejs", { list });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("./Listings/new.ejs");
});

//create new Listing
app.post("/listing/create", async (req, res) => {
  let { title, description, image, filename, price, location, country } =
    req.body;

  let newlist = Listing({
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

  res.redirect("/listing");
});

//Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("./Listings/edit.ejs", { list });
}); 

//update Listing
app.put("/listing/:id", async (req, res) => {
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

  res.redirect("/listing");
});

//delete Listing
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

connectdb();

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
