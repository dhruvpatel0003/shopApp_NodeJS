const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  let message='';
  if (req.session.flash) {
     message = req.session.flash.message;
  }
  console.log(message, "inside the getLogin");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.session.flash = { type: "error", message: "Invalid credentials" };
        return req.session.save((err) => {
          res.redirect("/login");
          console.log("inside the postLogin flash");
        });
        // return res.redirect("/login");
      }
      errorMessage = "";
      bcrypt.compare(password, user.password).then((exists) => {
        if (exists) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            // console.log(err);
            res.redirect("/");
          });
        }
        return res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log("error in fetching user");
      res.redirect("/login");
    });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage:''
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "SignUp",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((password) => {
          const user = new User({
            email: email,
            password: password,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
    }
    res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Resset Password",
    isAuthenticated: false,
  });
};
