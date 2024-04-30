const mongoose = require("mongoose");
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

module.exports = mongoose.model("authors", authorSchema);