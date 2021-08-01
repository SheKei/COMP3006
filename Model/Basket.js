class Credentials {

    constructor(basketId,userId, itemId, quantity) {
        this.basketID = basketId;
        this.userID = userId;
        this.itemID = itemId;
        this._basketId = basketId;
        this._userId = userId;
        this._itemId = itemId;
        this._quantity = quantity;
    }

    getBasketId() {
        return this._basketId;
    }

    getUserId() {
        return this._userId;
    }

    getItemId() {
        return this._itemId;
    }

    getQuantity() {
        return this._quantity;
    }
}

module.exports = Basket;