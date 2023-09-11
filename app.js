const express = require("express"); // Starts our connection with Express
const app = express(); // Starts our connection with Express
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// We start our connection to our Mongo DB through mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB connected!");
});

// Makes our connection to EJS, so we can show those views
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Tell express to parse the request body from our POST requests
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Render from our first Home page
app.get("/", (req, res) => {
    res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    // const { statusCode = 500, message = "Something went wrong :(" } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong! 😔"
    res.status(statusCode).render("error", { err });
});

// Starts our connection with Express
app.listen(3000, () => {
    console.log("Serving on port 3000");
});
