class Basket {

    constructor(basketId,userId, itemId, image, ItemName, quantity, Price) {
        this.basketID = basketId;
        this.userID = userId;
        this.itemID = itemId;
        this.img = image;
        this.itemName = ItemName;
        this.quantity = quantity;
        this.price = Price;
    }

    getBasketId() {
        return this.basketID;
    }

    getUserId() {
        return this.userID;
    }

    getItemId() {
        return this.itemID;
    }

    getImg(){
        return this.img;
    }

    getItemName(){
        return this.itemName;
    }

    getQuantity() {
        return this.quantity;
    }

    getIndividualPrice(){
        return this.price;
    }

    getTotalPrice(){
        return parseFloat(this.price)*parseFloat(this.quantity);
    }
}

module.exports = Basket;