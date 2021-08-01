let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

//Gather inputs to add new book
function addBook(request, response, imgFilename){
    let stockPrice = parseFloat(request.body.stockPound+"."+request.body.stockPenny);
    let sellPrice = parseFloat(request.body.sellPound+"."+request.body.sellPenny);
    let genres = addGenres(request);
    db.insertBook(
      request.body.authorForename, request.body.authorSurname,
      request.body.bookName,stockPrice, sellPrice, request.body.stockAmount,
      request.body.synopsis, genres, imgFilename
    );

    response.redirect("/Add_Book");
}

//Gather inputs to update details for existing stock book
function updateBook(request, response){
    let genres = addGenres(request);
    db.updateBook(mongoose.Types.ObjectId(request.body.bookID),
        request.body.authorForename, request.body.authorSurname,request.body.bookName,
        parseFloat(request.body.stockPound+"."+request.body.stockPenny), //Convert to float
        parseFloat(request.body.sellPound+"."+request.body.sellPenny),
        request.body.stockAmount, request.body.synopsis, genres, request.body.imgCover
    );
    response.redirect("/View_Stock_Book/"+request.body.bookID); //Refresh page
}

//Update file image for book cover
function updateBookImage(request, response, imgName){
    db.updateBookImage(mongoose.Types.ObjectId(request.body.theBookID), imgName);
    response.redirect("/View_Stock_Book/"+request.body.theBookID);//Refresh page
}

//Check which genres were checked
function addGenres(request){
    let genresArray = [];

    if(request.body.scifi === 'on'){genresArray.push('scifi');}
    if(request.body.adventure === 'on'){genresArray.push('adventure');}
    if(request.body.romance === 'on'){genresArray.push('romance');}
    if(request.body.historical === 'on'){genresArray.push('historical');}
    if(request.body.horror === 'on'){genresArray.push('horror');}
    if(request.body.fantasy === 'on'){genresArray.push('fantasy');}
    if(request.body.mystery === 'on'){genresArray.push('mystery');}
    if(request.body.comic === 'on'){genresArray.push('comic');}
    if(request.body.shortStories === 'on'){genresArray.push('short stories');}
    return genresArray;
}

//View books as stock items
async function getAllStockBooks(request, response){
    let books = await db.getAllBooks();
    if(books.length > 0){
        response.render("View_All_Stock",{"books": books});
    }
}

//View book items as a customer
async function getAllBookItems(request,response){
    let books = await db.getAllBooks();
    if(books.length > 0){
        response.render("View_All_Books",{"books": books});
    }
}

//Display current details of a selected stock item
async function viewStockBookItem(response, bookID){
    let book = await db.getOneBook(bookID);
    if(book !== undefined){
        response.render("View_Stock_Book",{
            "book": book,
            "stockPound":Math.floor(book.getStockPrice()),//SPLIT FLOAT PRICE TO INTEGERS & DECIMALS
            "stockPenny":Math.floor((book.getStockPrice() - Math.floor(book.getStockPrice()))*100),
            "sellPound":Math.floor(book.getSellingPrice()),
            "sellPenny":Math.floor((book.getSellingPrice() - Math.floor(book.getSellingPrice()))*100),
            "listGenres": convertArrayToString(book.getGenres())
        });
    }
}

//Display current details of a selected stock item
async function viewBookItem(response, bookID){
    let book = await db.getOneBook(bookID);
    console.log(book !== undefined);
    if(book !== undefined){
        response.render("View_Book",{
            "book": book
        });
    }
}

//Covert strings in an array to one string
function convertArrayToString(array){
    let string = "";
    for(let i=0;i<array.length;i++){
        string = string + array[i] + ",";
    }
    return string = string.substring(0, string.length - 1);
}



module.exports.addBook = addBook;
module.exports.updateBook = updateBook;
module.exports.updateBookImage = updateBookImage;
module.exports.getAllStockBooks = getAllStockBooks;
module.exports.viewStockBookItem = viewStockBookItem;
module.exports.getAllBookItems = getAllBookItems;
module.exports.viewBookItem = viewBookItem;

//scifi, adventure, romance, historical, horror, fantasy, mystery, comic, shortStories
//authorForename, authorSurname, bookName, stockPrice, sellingPrice,
// stockAmount, synopsis, genres, image