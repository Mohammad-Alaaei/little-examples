const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const author = require("../models/author");

// Loading authors list in async. way
router.get("/", async (req, res) => {
    try {
        const replaceExp = new RegExp("[^a-zA-Z0-9 ]", 'g');
        let searchOptions = {}

        // replace any signs from search queue by Name
        if (req.query.name && req.query.name != '') {
            req.query.name = req.query.name.replace(replaceExp, "");
            searchOptions.name = new RegExp(req.query.name, 'i');
        }

        // replace any signs from search queue by Age
        if (req.query.age && req.query.age != '') {
            req.query.age = req.query.age.replace(replaceExp, "");
            searchOptions.age = req.query.age;
        }

        var authors = await Author.find(searchOptions);
        // Loop through each author and calculate the number of books
        for (let i = 0; i < authors.length; i++) {
            const numberOfBooks = await Book.countDocuments({ author: authors[i]._id });
            authors[i].numberOfBooks = numberOfBooks;
        }

        // check if there is any Query about adding a author from 'Add author' page.
        let confirmMessage = null;
        let errorMessage = null;
        if (req.query.authorAdded === 'true') confirmMessage = 'Author added successfully.';
        if (req.query.authorDeleted === 'true') confirmMessage = 'Author Deleted successfully.';

        res.render("./authors/authors", {
            authors: authors,
            confirmMessage: confirmMessage,
            errorMessage: errorMessage,
            searchOptions: req.query
        });

    } catch (err) {
        console.error(err);
        console.log("Something went wrong during loading the authors List. redirecting to home page.");
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


router.put("/:id", (req, res) => {
    res.send(`Update author ID: ${req.params.id}`);
});

router.get("/:id", async (req, res) => {
    viewAuthorById(req.params.id, res);
});
router.delete("/:id", async (req, res) => {
    let author;
    try {
        author = await Author.findByIdAndDelete(req.params.id);

        res.redirect('/authors?authorDeleted=true');
    } catch (err) {
        console.error(err);
        console.log("Something went wrong during Deleting the author.");
        // res.redirect(`/authors/${req.params.id}?authorDeleted=false`);
        viewAuthorById(req.params.id, res, { errorMessage: err.message });
    }
});

async function viewAuthorById(authorId, res, { confirmMessage, errorMessage } = {}) {
    try {
        const author = await Author.findById(authorId);
        let authorBooks;
        if (author && author != '') {
            authorBooks = await Book.find({ author: author }).sort({ createdAt: 'desc' }).exec();
        }
        res.render('authors/view', {
            author,
            books: authorBooks,
            confirmMessage: confirmMessage,
            errorMessage: errorMessage
        });
    } catch (err) {
        console.error(err);
        console.log("Something went wrong during loading the author info. redirecting to the Authors list.");
        res.redirect('/authors');
    }
}

module.exports = router;