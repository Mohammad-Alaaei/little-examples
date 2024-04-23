const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");

app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
// app.use(express.static("public"));


app.use("/", indexRouter);


const listenPort = process.env.PORT || 8080;
app.listen(listenPort, () => {
    console.log(`Server started on port ${listenPort}`);
});