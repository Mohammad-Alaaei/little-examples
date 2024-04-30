const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        default: 6
    }
});

module.exports = mongoose.model("books", bookSchema);