let mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    authorForename: String,
    authorSurname: String,
    bookName: String,
    stockPrice: Number,
    sellingPrice: Number,
    stockAmount: Number,
    synopsis: String,
    genres:[{
        genre: String
    }],
    image: String
});

let Book = mongoose.model("book", bookSchema);
module.exports.Book = Book;