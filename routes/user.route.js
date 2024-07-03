const { Router } = require("express");
const router = Router();
const userController = require('../controllers/user.controller.js');


router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
})

router.post("/signin", userController.signinUser);

router.post('/signup', userController.signupUser);

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
})

module.exports = router;