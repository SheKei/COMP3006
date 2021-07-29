class Book{

    constructor(id,authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres) {

        this._id = id;
        this._authorForename = authorForename;
        this._authorSurname = authorSurname;
        this._bookName = bookName;
        this._stockPrice = stockPrice;
        this._sellingPrice = sellingPrice;
        this._stockAmount = stockAmount;
        this._synopsis = synopsis;
        this._genres = genres;
    }
    //id, forename, surname, bookname, stockprice, sellprice, stockAmount, synopsis, genres
    getId(){
        return this._id;
    }

    getAuthorForename() {
        return this._authorForename;
    }

    getAuthorSurname() {
        return this._authorSurname;
    }

    getBookName() {
        return this._bookName;
    }

    getStockPrice() {
        return this._stockPrice;
    }

    getSellingPrice() {
        return this._sellingPrice;
    }

    getStockAmount() {
        return this._stockAmount;
    }

    getSynopsis() {
        return this._synopsis;
    }

    getGenres() {
        return this._genres;
    }
}

module.exports = Book;