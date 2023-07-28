const express = require("express");
const { check } = require('express-validator');



const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post("/login", authController.postLogin);

router.post("/signup", check('email').isEmail().withMessage('Enter a valid email'),authController.postSignup);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

module.exports = router;
