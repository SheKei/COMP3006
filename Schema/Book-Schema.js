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
//authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image
let Book = mongoose.model("book", bookSchema);
module.exports.Book = Book;