require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


const { checkForAuthenticateCookie } = require('./middlewares/authentication')
const userRoute = require("./routes/user.route");
const blogRoute = require("./routes/blog.route")
const Blog = require("./models/blog.model");


//create express app
const app = express();
const PORT = process.env.PORT || 8000;

//DB Connection
mongoose
    .connect(process.env.MONGODB_URL)
    .then((e) => console.log("MongoDB Connected"));

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticateCookie("token"))
app.use(express.static(path.resolve("./public")));

//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//routes
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`server started at port ${PORT}`));