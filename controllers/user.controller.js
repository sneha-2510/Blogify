const User = require('../models/user.model.js')

exports.signupUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    await User.create({
        fullname,
        email,
        password
    });
    return res.redirect("/");
}

exports.signinUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // console.log(token);

        return res.cookie('token', token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or password",
        });
    }
}