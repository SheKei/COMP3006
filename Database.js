let mongoose = require("mongoose");

//CONNECT TO DATABASE
let dbUrl = "mongodb://localhost:27017/bookstoredb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//IMPORT SCHEMAS
let Account = require("./Schema/Account-Schema").Account;
let Book = require("./Schema/Book-Schema").Book;

//IMPORT MODEL CLASSES
let BookClass = require("./Model/Book");

//PROCEDURES

//Create a new book item after stock form submission
function insertBook(authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    let bookObj = {authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image};
    Book.collection.insertOne(bookObj, function(err){
        if(err){console.log(err);}
    });
}

//Get all books
async function getAllBooks(){
    let books = await Book.find({});
    let bookObjArray = [];
    if(books[0] !== undefined){
        for(let i=0; i<books.length; i++){
           bookObj = new BookClass(
                books[i]._id, books[i].authorForename, books[i].authorSurname,
                books[i].bookName, books[i].stockPrice, books[i].sellingPrice,
                books[i].stockAmount, books[i].synopsis, books[i].genres, books[i].image
            );
            bookObjArray.push(bookObj);
        }
    }
    return bookObjArray;
}

//Create a new account upon registration
function insertAccount(firstname, lastname, birthday, email, streetName,postCode,password){
    let accountObj = {firstname: firstname, lastname: lastname, birthday:birthday, email:email, streetName:streetName, postCode:postCode, password:password};
    Account.collection.insertOne(accountObj, function(err){
       if(err){console.log(err);}
    });
}

module.exports.insertBook = insertBook;
module.exports.insertAccount = insertAccount;
module.exports.getAllBooks = getAllBooks;