const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
    try {
        const books = await Book.find({});
        res.render("./books/books", { books: books });
    } catch {
        console.log("Something went wrong during the loading of the Books List. redirecting to home page.");
        res.redirect("/");
    }
});

router.post("/", (req, res) => {
    const { name, author, age } = req.body;

    const book = new Book({
        name,
        author,
        age
    });
    
    book.save().then((newBook) => {
        console.log(`Book #${newBook._id} Added Successfuly.`);
        // res.redirect(`books/${newBook._id}`);

        res.redirect("books");
    }).catch(() => {
        res.render("books/new", {
            book: book,
            errorMessage: "Faild to add the book."
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