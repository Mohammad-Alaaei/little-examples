const mongoose = require("mongoose");
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
        default: 0
    }
});
// TODO:
authorSchema.pre('findOneAndDelete', async function (next) {
    try {
        const book = await Book.find({ author : this._conditions._id});

        if (book.length > 0) {
            next(new Error(`${book.length} Book(s) found. you can't remove this Author before deleting the Books related to.`));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("authors", authorSchema);