let db = require("../database");
let session = require('express-session');

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

async function getAllStockBooks(request, response){
    let books = await db.getAllBooks();
    if(books.length > 0){
        response.render("View_All_Stock",{"books": books});
    }
}


module.exports.addBook = addBook;
module.exports.getAllStockBooks = getAllStockBooks;

//scifi, adventure, romance, historical, horror, fantasy, mystery, comic, shortStories
//authorForename, authorSurname, bookName, stockPrice, sellingPrice,
// stockAmount, synopsis, genres, image