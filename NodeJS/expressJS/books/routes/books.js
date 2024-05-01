const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// Loading Books list in async. way
router.get("/", async (req, res) => {
    try {
        const replaceExp = new RegExp("[?:/\~!@#$%^&*()_+<>;\"'.]", 'g');
        let searchOptions = {}

        if (req.query.name && req.query.name != '') {
            req.query.name = req.query.name.replace(replaceExp, "");
            searchOptions.name = new RegExp(req.query.name, 'i');
        }

        if (req.query.author && req.query.author != '') {
            req.query.author = req.query.author.replace(replaceExp, "");
            searchOptions.author = new RegExp(req.query.author, 'i');
        }

        if (req.query.age && req.query.age != '') {
            req.query.age = req.query.age.replace(replaceExp, "");
            searchOptions.age = req.query.age;
        }

        const books = await Book.find(searchOptions);

        // check if there is any Query about adding a book fro 'Add book' page.
        const bookAdded = req.query.bookAdded === 'true' ? 'Book added successfully.' : null;

        res.render("./books/books", {
            books: books,
            confirmMessage: bookAdded,
            searchOptions: req.query
        });

    } catch {
        console.log("Something went wrong during the loading of the Books List. redirecting to home page.");
        res.redirect("/");
    }
});

// save new book in database
router.post("/", async (req, res) => {
    // extract input data from form
    const { name, author, age } = req.body;
    const book = new Book({
        name,
        author,
        age
    });

    // try to save new book to database.
    await book.save()
        .then((newBook) => {
            console.log(`Book #${newBook._id} Added Successfully.`);
            // res.redirect(`books/${newBook._id}`);

            res.redirect("books?bookAdded=true");

        }).catch(() => {
            res.render("books/new", {
                book: book,
                errorMessage: "Failed to add the book."
            });
        });

});

router.get("/new", (req, res) => {
    res.render("./books/new", { book: new Book });
});

router.route("/:id")
    .get((req, res) => {
        res.send(`Book ID: ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update Book ID: ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete Book ID: ${req.params.id}`);
    })

module.exports = router;