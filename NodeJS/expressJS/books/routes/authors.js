const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// Loading authors list in async. way
router.get("/", async (req, res) => {
    try {
        const replaceExp = new RegExp("[?:/\~!@#$%^&*()_+<>;\"'.]", 'g');
        let searchOptions = {}

        if (req.query.name && req.query.name != '') {
            req.query.name = req.query.name.replace(replaceExp, "");
            searchOptions.name = new RegExp(req.query.name, 'i');
        }

        if (req.query.age && req.query.age != '') {
            req.query.age = req.query.age.replace(replaceExp, "");
            searchOptions.age = req.query.age;
        }

        const authors = await Author.find(searchOptions);

        // check if there is any Query about adding a author fro 'Add author' page.
        const authorAdded = req.query.authorAdded === 'true' ? 'Author added successfully.' : null;

        res.render("./authors/authors", {
            authors: authors,
            confirmMessage: authorAdded,
            searchOptions: req.query
        });

    } catch {
        console.log("Something went wrong during the loading of the authors List. redirecting to home page.");
        res.redirect("/");
    }
});

// save new author in database
router.post("/", async (req, res) => {
    // extract input data from form
    const { name, age } = req.body;
    const author = new Author({
        name,
        age
    });

    // try to save new author to database.
    await author.save()
        .then((newauthor) => {
            console.log(`Author #${newauthor._id} Added Successfully.`);
            // res.redirect(`authors/${newauthor._id}`);

            res.redirect("authors?authorAdded=true");

        }).catch(() => {
            res.render("authors/new", {
                author: author,
                errorMessage: "Failed to add the author."
            });
        });

});

router.get("/new", (req, res) => {
    res.render("./authors/new", { author: new Author });
});

router.route("/:id")
    .get((req, res) => {
        res.send(`author ID: ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update author ID: ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete author ID: ${req.params.id}`);
    })

module.exports = router;