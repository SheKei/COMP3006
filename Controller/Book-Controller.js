let db = require("../Database");
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

//Delete book using book ID
function deleteBook(bookID,request, response){
    db.deleteBook(bookID);
    response.redirect("/View_All_Stock");
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
    }else{
        response.render("View_All_Stock",{"books": []});
    }
}

//View book items as a customer
async function getAllBookItems(userID,request,response){
    let books = await db.getAllBooks();
    let basketNum = await db.returnNumOfItemsInBasket(userID);
    if(books.length > 0){
        response.render("View_All_Books",{"books": books,"basketNum": basketNum});
    }
}

async function getFilteredBooks(userID,request,response){
    let genres = addGenres(request);
    if(genres.length>0){
        let books = await db.getFilteredBooks(genres);
        let basketNum = await db.returnNumOfItemsInBasket(userID);
        if(books !== null){
            response.render("View_All_Books",{"books": books,"basketNum": basketNum});
        }else{
            response.redirect("/View_All_Books");
        }
    }else{
        response.redirect("/View_All_Books");
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

//Display current details of a selected book as customer
async function viewBookItem(userID,response, bookID){
    let book = await db.getOneBook(bookID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);

    if(book !== undefined){
        let genres = convertArrayToString(book.getGenres());
        response.render("View_Book",{
            "book": book,
            "theGenres": genres,
            "basketNum": basketNum
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
module.exports.deleteBook = deleteBook;
module.exports.updateBook = updateBook;
module.exports.updateBookImage = updateBookImage;
module.exports.getAllStockBooks = getAllStockBooks;
module.exports.viewStockBookItem = viewStockBookItem;
module.exports.getAllBookItems = getAllBookItems;
module.exports.viewBookItem = viewBookItem;
module.exports.getFilteredBooks = getFilteredBooks;
