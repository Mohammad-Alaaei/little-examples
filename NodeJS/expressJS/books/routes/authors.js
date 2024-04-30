const express = require("express");
const router = express.Router();
const Author = require("../models/author");

router.get("/", async (req, res) => {
    try {
        const authors = await Author.find({});
        res.render("./authors/authors", { authors: authors });
    } catch {
        console.log("Something went wrong during the loading of the authors List. redirecting to home page.");
        res.redirect("/");
    }
});

router.post("/", (req, res) => {
    const { name, age } = req.body;

    const author = new Author({
        name,
        age
    });
    
    author.save().then((newAuthor) => {
        console.log(`Author #${newAuthor._id} Added Successfuly.`);
        // res.redirect(`authors/${newAuthor._id}`);

        res.redirect("authors");
    }).catch(() => {
        res.render("authors/new", {
            author: author,
            errorMessage: "Faild to add the Author."
        });
    });

});

router.get("/new", (req, res) => {
    res.render("./authors/new", { author: new Author });
});

router.route("/:id")
    .get((req, res) => {
        res.send(`Author ID: ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update Author ID: ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete Author ID: ${req.params.id}`);
    })

module.exports = router;