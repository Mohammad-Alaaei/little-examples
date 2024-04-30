// .env
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const appPort = process.env.PORT || 8080;
const appHost = process.env.HOST || "0.0.0.0";
const dbUrl = process.env.DB_URL || '';

// Modules
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Routes
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const authorsRouter = require("./routes/authors");

// Config
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

// Database
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

// Middlewares
app.use(expressLayout);
app.use(bodyParser.urlencoded({extended:false}));

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use(express.static("public"));

const server = app.listen(appPort, appHost, () => {
    console.log(`Server started on ${appHost}:${appPort}`);
});

server.on("error", (error) => {
    console.error(error.message);
    console.log("Server will now shutdown.");
    process.exit(1);
});