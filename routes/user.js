const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const UserController = require("../Controller/UserController");

router.get("/signup", UserController.signupPage);

router.post("/signup", UserController.signUp);

router.get("/login", UserController.loginPage);

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  UserController.login
);

router.get("/logout", UserController.logout);

module.exports = router;
