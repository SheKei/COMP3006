let mongoose = require("mongoose");

//CONNECT TO DATABASE
let dbUrl = "mongodb://localhost:27017/bookstoredb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//IMPORT SCHEMAS
let Account = require("./Schema/Account-Schema").Account;
let Book = require("./Schema/Book-Schema").Book;

//IMPORT MODEL CLASSES
let BookClass = require("./Model/Book");
let Credentials = require("./Model/Credentials");
let AccountClass = require("./Model/Account");

//PROCEDURES

//Create a new book item after stock form submission
function insertBook(authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    let bookObj = {authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image};
    Book.collection.insertOne(bookObj, function(err){
        if(err){console.log(err);}
    });
}

//Update details of a stock book
function updateBook(bookID,authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres, image){
    Book.collection.updateOne(
        {_id:mongoose.Types.ObjectId(bookID)},
        {
            $set:{authorForename:authorForename, authorSurname: authorSurname, bookName:bookName, stockPrice:stockPrice, sellingPrice:sellingPrice, stockAmount:stockAmount, synopsis:synopsis, genres: genres, image:image}
        });
}

//Update file image for an existing book
function updateBookImage(bookID, imageName){
    Book.collection.updateOne(
        {_id:mongoose.Types.ObjectId(bookID)},
        {$set:{image:imageName}}
    );
}

//Get all books and return as an array of book objects
async function getAllBooks(){
    let books = await Book.find({});
    let bookObjArray = [];
    if(books[0] !== undefined){
        for(let i=0; i<books.length; i++){ //For each result
           bookObj = new BookClass(        //Convert to a book obj
                books[i]._id, books[i].authorForename, books[i].authorSurname,
                books[i].bookName, books[i].stockPrice, books[i].sellingPrice,
                books[i].stockAmount, books[i].synopsis, books[i].genres, books[i].image
            );
            bookObjArray.push(bookObj);    //Then add to array
        }
        return bookObjArray;
    }else{return null;}                    //Return null if no results
}

//Get one book using its id and return it as a book object
async function getOneBook(bookID){
    let books = await Book.find({_id: bookID});
    if(books[0] !== undefined){
        return new BookClass(
            books[0]._id, books[0].authorForename, books[0].authorSurname,
            books[0].bookName, books[0].stockPrice, books[0].sellingPrice,
            books[0].stockAmount, books[0].synopsis, books[0].genres, books[0].image
        );
    }else{return null;}
}

//Create a new account upon registration
function insertAccount(firstname, lastname, birthday, email, streetName,postCode,password){
    let accountObj = {firstname: firstname, lastname: lastname, birthday:birthday, email:email, streetName:streetName, postCode:postCode, password:password};
    Account.collection.insertOne(accountObj, function(err){
       if(err){console.log(err);}
    });
}

//Find an existing account using email address
async function checkLoginCredentials(inputEmail){
    let credentials = await Account.find({email: inputEmail});
    let loginAccount = null;
    if(credentials[0] !== undefined){
        loginAccount = new Credentials(credentials[0].email, credentials[0].password);
    }
    return loginAccount;
}

//Get account credentials
async function getLoginCredentials(emailAddress){
    let account = await Account.find({email: emailAddress});
    let theAccount = null;
    if(account[0] !== undefined){
        console.log("in here");
        theAccount = new AccountClass(account[0]._id,account[0].firstname,account[0].lastname, account[0].birthday, account[0].email, account[0].streetName, account[0].postCode, account[0].password);
    }
    return theAccount;
}

module.exports.insertBook = insertBook;
module.exports.updateBook = updateBook;
module.exports.updateBookImage = updateBookImage;
module.exports.getAllBooks = getAllBooks;
module.exports.getOneBook = getOneBook;

module.exports.insertAccount = insertAccount;
module.exports.getLoginCredentials = getLoginCredentials;