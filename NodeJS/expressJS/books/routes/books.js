const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Book = require("../models/book");
const Author = require("../models/author");

// setup requirements for uploading books cover
const bookCoverUploadPath = path.join('public', Book.coverImagePath);
const multer = require('multer');
const imageFileFormats = ['image/jpeg', 'image/png', 'image/bmp'];
const upload = multer({
    dest: bookCoverUploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageFileFormats);
    }
});

// Loading Books list in async. way
router.get("/", async (req, res) => {
    const replaceExp = new RegExp("[?:/\~!@#$%^&*()_+<>;\"'.]", 'g');

    let query = Book.find();

    if (req.query.title != null && req.query.title != '') {
        req.query.title = req.query.title.replace(replaceExp, "");
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }

    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }

    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }

    try {

        const books = await query.exec();
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
router.post("/", upload.single('coverImage'), async (req, res) => {
    const coverFileName = (req.file != null) ? req.file.filename : null;
    // extract input data from form
    const { title, description, pageCount, author, publishDate, createdAt } = req.body;
    const book = new Book({
        title,
        description,
        pageCount,
        author,
        publishDate: new Date(publishDate),
        createdAt,
        coverImage: coverFileName
    });

    // try to save new book to database.
    await book.save()
        .then((newBook) => {
            console.log(`Book #${newBook._id} Added Successfully.`);
            // res.redirect(`books/${newBook._id}`);

            res.redirect("books?bookAdded=true");

        }).catch(() => {
            removeBookCover(book.coverImage);
            renderNewPage(res, book, "Failed to add the book.");
            // res.render("books/new", {
            //     book: book,
            //     errorMessage: "Failed to add the book."
            // });
        });

});

router.get("/new", async (req, res) => {
    // // just for test:
    // const book = await Book.findOne({title: 'test', description: "asdasd", pageCount: 321}); 
    // renderNewPage(res, book);

    renderNewPage(res, new Book);
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

function removeBookCover(fileName) {
    const coverPath = path.join(bookCoverUploadPath, fileName);
    if (fileName != null && fileName != '') {
        fs.unlink(coverPath, (err) => {
            if (err) {
                console.error(`Couln't delete the file ${coverPath}`);
            } else {
                console.error(`${coverPath} removed successfully.`);
            }
        });
    }
}

async function renderNewPage(res, book, errorMessage = null) {
    try {
        const authors = await Author.find({});
        const params = {
            book: book,
            bookCoverUploadPath: '/' + Book.coverImagePath.replace('\\', '/') + '/',
            authors: authors
        };

        if (errorMessage != null && errorMessage != '') params.errorMessage = errorMessage;
        res.render("./books/new", params);
    } catch {
        console.log("Something went wrong when fetching book data.");
        res.redirect("/books");
    }
}

module.exports = router;