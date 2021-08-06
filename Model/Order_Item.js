class Order_Item {

    constructor(itemID, itemName, orderQuantity, totalItemPrice) {
        this._itemID = itemID;
        this._itemName = itemName;
        this._orderQuantity = orderQuantity;
        this._totalItemPrice = totalItemPrice;
    }


    getItemID() {
        return this._itemID;
    }

    getItemName() {
        return this._itemName;
    }

    getOrderQuantity() {
        return this._orderQuantity;
    }

    getTotalItemPrice() {
        return this._totalItemPrice;
    }
}

module.exports = Order_Item;