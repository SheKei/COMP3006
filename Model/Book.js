class Book{

    constructor(authorForename, authorSurname, bookName, stockPrice, sellingPrice, stockAmount, synopsis, genres) {

        this._authorForename = authorForename;
        this._authorSurname = authorSurname;
        this._bookName = bookName;
        this._stockPrice = stockPrice;
        this._sellingPrice = sellingPrice;
        this._stockAmount = stockAmount;
        this._synopsis = synopsis;
        this._genres = genres;
    }

    get authorForename() {
        return this._authorForename;
    }

    get authorSurname() {
        return this._authorSurname;
    }

    get bookName() {
        return this._bookName;
    }

    get stockPrice() {
        return this._stockPrice;
    }

    get sellingPrice() {
        return this._sellingPrice;
    }

    get stockAmount() {
        return this._stockAmount;
    }

    get synopsis() {
        return this._synopsis;
    }

    get genres() {
        return this._genres;
    }
}