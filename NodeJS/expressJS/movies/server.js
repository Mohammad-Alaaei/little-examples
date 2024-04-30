if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// Environment variables
const listenPort = process.env.LISTEN_PORT || 8080;
const listenHost = process.env.LISTEN_HOST || "0.0.0.0";
const dbUrl = process.env.DB_URL || '';

// Requirments
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

// Routers
const indexRouter = require("./routes/index");
const moviesRouter = require("./routes/movies");

// Config
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // must be before routes
app.use("/", indexRouter);
app.use("/movies", moviesRouter);
app.use(express.static("public"));  // must be after routes

// Database
const mongoose = require("mongoose");
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

// Start Server
const server = app.listen(listenPort, listenHost, () => {
    console.log(`Server started on port ${listenHost}:${listenPort}`);
});

server.on("error", error => {
    console.error(error.message);
    console.log("App will now close due to an error.")
    process.exit(1);
});