const express = require("express");
const app = express();
const path = require("path");
const connectdb = require("./connectDB");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const User = require("./Model/User");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const ExpresError = require("./utils/ExpressError");
const port = 8080;
const sessionoption = {
  secret: "SECRETKEYS",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req, res) => {
//   let fakeuser = await new User({
//     email: "delta@gmail.com",
//     username: "delatastudent1",
//   });

//   let demo = await User.register(fakeuser, "parth");
//   res.send(demo);
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id", reviewRouter);
app.use("/", userRouter);

//Page Not Found
app.use((req, res, next) => {
  next(new ExpresError(404, "Page Not Found!"));
});

// //error handling
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!" } = err;
  res.status(status).render("Error.ejs", { message });
});

connectdb();

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
