const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Book = require("../models/book");
const Author = require("../models/author");

const replaceExp = new RegExp("[^a-zA-Z0-9ا-ی ]", 'g');

// setup requirements for uploading books cover
const bookCoverUploadPath = path.join('public', Book.coverImagePath);
const multer = require('multer');
const author = require("../models/author");
const { default: mongoose } = require("mongoose");
const imageFileFormats = ['image/jpeg', 'image/png', 'image/bmp'];
const upload = multer({
    dest: bookCoverUploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageFileFormats);
    }
});

// Loading Books list in async way
router.get("/", async (req, res) => {

    let query = Book.find();

    // Search section validation
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

    // used to add Author's name from author model to query.
    // query.populate('author', 'name');

    try {

        const books = await query.exec();
        // check if there is any Query about adding a book from 'Add book' page.
        const bookAdded = req.query.bookAdded === 'true' ? 'Book added successfully.' : null;
        const bookDeleted = req.query.bookDeleted === 'true' ? 'Book deleted successfully.' : null;

        res.render("./books/books", {
            books: books,
            confirmMessage: bookAdded || bookDeleted,
            searchOptions: req.query
        });

        // for API:
        // res.json([{
        //     books: books,
        //     confirmMessage: bookAdded || bookDeleted,
        //     searchOptions: req.query
        // }])

    } catch (err) {
        console.log("Something went wrong during the loading of the Books List. redirecting to home page.");
        console.error(err.message);
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
            renderNewPage(res, book, { errorMessage: "Failed to add the book." });
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
    let params = {};

    if (req.body.authorId) {
        let id = req.body.authorId;
        id.replace(replaceExp, "");
        params = { authorId: id };
    }

    renderNewPage(res, new Book, params);
});

router.route("/:id")
    .get(async (req, res) => {
        const book = await Book.findById(req.params.id);
        console.log(book);
        res.render("books/view", { book })
    })
    .put((req, res) => {
        res.send(`Update Book ID: ${req.params.id}`);
    })
    .delete(async (req, res) => {
        let book;
        try {
            book = await Book.findByIdAndDelete(req.params.id);

            res.redirect('/books?bookDeleted=true');
        } catch (err) {
            console.log("Something went wrong during Deleting the Book.");
            console.error(err);
            res.redirect(`/books?bookDeleted=false`);
            // viewBookById(req.params.id, res, {errorMessage: err.message});
        }
    })

function removeBookCover(fileName) {
    if (fileName != null && fileName != '') {
        const coverPath = path.join(bookCoverUploadPath, fileName);
        fs.unlink(coverPath, (err) => {
            if (err) {
                console.error(`Couln't delete the file ${coverPath}`);
            } else {
                console.error(`${coverPath} removed successfully.`);
            }
        });
    }
}

async function renderNewPage(res, book, { authorId, confirmMessage, errorMessage } = {}) {
    try {
        const authorParams = (authorId && authorId != '') ? { _id: authorId } : {};
        const authors = await Author.find(authorParams);
        const params = {
            book: book,
            bookCoverUploadPath: '/' + Book.coverImagePath.replace('\\', '/') + '/',
            authors: authors
        };

        if (errorMessage != null && errorMessage != '') params.errorMessage = errorMessage;
        res.render("./books/new", params);
    } catch (err) {
        console.log("Something went wrong when fetching book data.");
        console.error(err.message);
        res.redirect("/books");
    }
}

module.exports = router;