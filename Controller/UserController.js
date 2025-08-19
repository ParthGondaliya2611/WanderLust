const User = require("../Model/User");

const UserController = {
  signupPage: (req, res) => {
    res.render("users/signup.ejs");
  },
  signUp: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password); // passport-local-mongoose

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  },
  loginPage: (req, res) => {
    res.render("users/login.ejs");
  },
  login: async (req, res) => {
    req.flash("success", "Welcome Back WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logout User Succesfully!");
      res.redirect("/listings"); // or wherever you want to redirect after logout
    });
  },
};

module.exports = UserController;
