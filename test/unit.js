let db = require('../Database');
let chai = require("chai");
let bcrypt = require('bcrypt');
let saltRounds = 10;

suite("Test Account Functionality", async function() {

    test("Test Adding of an Account", async function (){
        //forename, surname, dateOfBirth, emailAddress,
        // street, thePostCode, thePassword
        let password = "thePassword";
        let hashedPassword = bcrypt.hashSync(password, saltRounds);
        db.insertAccount("forename", "surname", "12/10/1999", "email@email.com", "street", "thePostCode", hashedPassword);

        let account1 = await db.getLoginCredentials("email@email.com");
        let account2 = await db.getLoginCredentials("shouldNotExist");

        chai.assert.isNull(account2, "Should be null, account does not exist");
        chai.assert.isNotNull(account1, "Should not be null, account exists");

        let id = account1.getUserID();
        db.deleteAccount(id);
        let checkAccount1 = db.getLoginCredentials("email@email.com");
        chai.assert.isEmpty(checkAccount1, "Should be empty, account deleted");
    });

    test("Test Login Function", async function (){
        let email = "JohnJohnny@gmail.com";
        let correctPassword = "12YeetEggs!";
        let incorrectPassword = "IncorrectPassword";

        let loginCredentials = await db.getLoginCredentials(email);
        let actualPassword = loginCredentials.getPassword();

        let access = bcrypt.compareSync(correctPassword, actualPassword);
        chai.assert.isTrue(access,"Should be correct password so access true");

        access = bcrypt.compareSync(incorrectPassword, actualPassword);
        chai.assert.isFalse(access, "Should be incorrect password so access false");
    });

    test("Test Update Account Details", async function(){
        let userID = "610580434665755c249b5b9e";
        let account = await db.getAccount(userID);

        chai.assert.equal(account.getFirstName(), "John", "First name should be John");
        chai.assert.equal(account.getSurname(), "Johnny", "Last name should be Johnny");

        let changeFirstName = "Harry";
        db.updateAccountDetails(userID,changeFirstName, account.getSurname(), account.getDateOfBirth(), account.getEmail(), account.getStreet(), account.getPostCode());

        account = await db.getAccount(userID);

        chai.assert.equal(account.getFirstName(), changeFirstName, "First name should be Harry");
        chai.assert.equal(account.getSurname(), "Johnny", "Last name should be Johnny");

        db.updateAccountDetails(userID,"John", account.getSurname(), account.getDateOfBirth(), account.getEmail(), account.getStreet(), account.getPostCode());
    });

    test("Test Update Password", async function(){
        let userID = "610580434665755c249b5b9e";
        let account = db.getAccount(userID);
        let originalPassword = "12YeetEggs!";

        let newPassword = "13YeetEggs!";
        let hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);

        db.updatePassword(userID, hashedNewPassword);

        let credentials = await db.getAccount(userID);
        let actualPassword = credentials.getPassword();

        let access = bcrypt.compareSync("13YeetEggs!", actualPassword);
        chai.assert.isTrue(access,"Should be correct password so access true");

        hashedNewPassword = bcrypt.hashSync(originalPassword, saltRounds);
        db.updatePassword(userID, hashedNewPassword);
    });
});

suite("Test Book Functionality", async function() {

    test("Test Retrieving a Book", async function (){
        //id, forename, surname, bookname, stockprice, sellprice,
        // stockAmount, synopsis, genres, image
        let bookID = "6102c14551afa35e78772484";
        let bookObj = await db.getOneBook(bookID);

        chai.assert.equal(bookObj.getBookName(), "Aliens are Real", "book name should be the same");
        chai.assert.equal(bookObj.getId(), "6102c14551afa35e78772484", "should be same id");
    });

    test("Test Book Editing Function", async function (){
        let bookID = "6102c14551afa35e78772484";
        let updatedBookName = "Aliens aren't Real";

        let bookObj = await db.getOneBook(bookID);
        chai.assert.equal(bookObj.getBookName(), "Aliens are Real", "book name should be the same");

        db.updateBook(bookID,"Bob","Bobby", updatedBookName,4.99, 9.99,
            99,"Quisque placerat erat et finibus luctus. Sed non neque quis dolor accumsan facilisis.",
            [ "scifi", "adventure" ], "imgCover-1627570501977.jpg");

        bookObj = await db.getOneBook(bookID);
        chai.assert.equal(bookObj.getBookName(), "Aliens aren't Real", "book name should be the same");
        chai.assert.equal(bookObj.getId(), "6102c14551afa35e78772484", "should be same id");

        db.updateBook(bookID,"Bob","Bobby", "Aliens are Real",4.99, 9.99,
            99,"Quisque placerat erat et finibus luctus. Sed non neque quis dolor accumsan facilisis.",
            [ "scifi", "adventure" ], "imgCover-1627570501977.jpg");

    });

    test("Test Update Book Image", async function(){
        let bookID = "6102c14551afa35e78772484";
        let originalImg = "imgCover-1627570501977.jpg";
        let newImg = "imgCover.jpg";

        let bookObj = await db.getOneBook(bookID);
        chai.assert.equal(bookObj.getImage(), "imgCover-1627570501977.jpg", "image name should be the same");

        db.updateBook(bookID,"Bob","Bobby", "Aliens are Real",4.99, 9.99,
            99,"Quisque placerat erat et finibus luctus. Sed non neque quis dolor accumsan facilisis.",
            [ "scifi", "adventure" ], newImg);

        bookObj = await db.getOneBook(bookID);
        chai.assert.equal(bookObj.getImage(), "imgCover.jpg", "image name should be the same");
        chai.assert.equal(bookObj.getId(), "6102c14551afa35e78772484", "should be same id");

        db.updateBook(bookID,"Bob","Bobby", "Aliens are Real",4.99, 9.99,
            99,"Quisque placerat erat et finibus luctus. Sed non neque quis dolor accumsan facilisis.",
            [ "scifi", "adventure" ], originalImg);
    });

});

suite("Test Chat Message Functionality", async function() {

    test("Test Adding a Book to Basket", async function (){
        let bookID = "6102c14551afa35e78772484";
        let userID = "610580434665755c249b5b9e";
        let quantity = 1;

        await db.checkBasket(userID, bookID, quantity);
        let basketItems = await db.getAllItemsInBasket(userID);
        chai.assert.equal(basketItems[0].getUserId(), "610580434665755c249b5b9e", "User ID should be same");
        chai.assert.equal(basketItems[0].getItemId(), "6102c14551afa35e78772484", "Item ID should be same");
        chai.assert.equal(basketItems[0].getQuantity(), 1, "Should be 1 copy");

        let number = await db.returnNumOfItemsInBasket(userID);
        chai.assert.equal(number, 1, "Should be 1 item in basket");

        await db.checkout(userID);

        number = await db.returnNumOfItemsInBasket(userID);
        chai.assert.equal(number, 0, "Should be no items in basket");

        basketItems = await db.getAllItemsInBasket(userID);
        chai.assert.isEmpty(basketItems, "should be no items in basket");

        db.deleteTestOrder(userID, bookID);
    });

    test("Test Retrieving Test Orders", async function (){
        let deliveredOrderID = "610ef13862268f40b47c1a7b";
        let awaitingOrderID = "610ef25ff6ae833968c40b06";

        let awaitingOrder = await db.getSelectedOrder("610ef13862268f40b47c1a7b");
        let deliveredOrder = await db.getSelectedOrder("610ef25ff6ae833968c40b06");

        chai.assert.equal(awaitingOrder.getOrderID(),"610ef25ff6ae833968c40b06", "Order id should be the same unless it has been deleted");
        chai.assert.eqal(awaitingOrder.getOrderStatus(), "Awaiting", "Status should be awaiting (unless it has been processed)");

        chai.assert.equal(deliveredOrder.getOrderID(),"610ef13862268f40b47c1a7b", "Order id should be the same unless it has been deleted");
        chai.assert.eqal(deliveredOrder.getOrderStatus(), "Delivered", "Status should be delivered");
    });

});



suite("Test Basket Functionality", async function() {

    test("Test Adding a Book to Basket", async function (){
        let bookID = "6102c14551afa35e78772484";
        let userID = "610580434665755c249b5b9e";
        let quantity = 1;

        await db.checkBasket(userID, bookID, quantity);
        let basketItems = await db.getAllItemsInBasket(userID);

        chai.assert.equal(basketItems[0].getUserId(), "610580434665755c249b5b9e", "User ID should be same");
        chai.assert.equal(basketItems[0].getItemId(), "6102c14551afa35e78772484", "Item ID should be same");
        chai.assert.equal(basketItems[0].getQuantity(), 1, "Should be 1 copy");
        chai.assert.equal(basketItems[0].getIndividualPrice(), 9.99, "Price should be 9.99");
        chai.assert.equal(basketItems[0].getTotalPrice(), 9.99, "Total Price should be 1 x 9.99");

        await db.checkBasket(userID, bookID, quantity);
        basketItems = await db.getAllItemsInBasket(userID);

        chai.assert.equal(basketItems[0].getUserId(), "610580434665755c249b5b9e", "User ID should be same");
        chai.assert.equal(basketItems[0].getItemId(), "6102c14551afa35e78772484", "Item ID should be same");
        chai.assert.equal(basketItems[0].getQuantity(), 2, "Should be 2 copies");
        chai.assert.equal(basketItems[0].getIndividualPrice(), 9.99, "Price should be 9.99");
        chai.assert.equal(basketItems[0].getTotalPrice(), 19.98, "Total Price should be  19.98 = 2 x 9.99");
    });

    test("Test Number of Item Types in Basket", async function (){
        let bookID = "6102c14551afa35e78772484";
        let userID = "610580434665755c249b5b9e";

        let number = await db.returnNumOfItemsInBasket(userID);
        chai.assert.equal(number, 1, "Should be 1 item in basket");
    });

    test("Test Removing Item from basket", async function (){
        let bookID = "6102c14551afa35e78772484";
        let userID = "610580434665755c249b5b9e";

        db.removeItemFromBasket(userID,bookID);

        let basketItems = await db.getAllItemsInBasket(userID);
        chai.assert.equal(basketItems.length, 0, "Basket should be empty");
    });

});

suite("Test Checkout Order Functionality", async function() {

    test("Test Adding a Book to Basket", async function (){
        let bookID = "6102c14551afa35e78772484";
        let userID = "610580434665755c249b5b9e";
        let quantity = 1;

        await db.checkBasket(userID, bookID, quantity);
        let basketItems = await db.getAllItemsInBasket(userID);
        chai.assert.equal(basketItems[0].getUserId(), "610580434665755c249b5b9e", "User ID should be same");
        chai.assert.equal(basketItems[0].getItemId(), "6102c14551afa35e78772484", "Item ID should be same");
        chai.assert.equal(basketItems[0].getQuantity(), 1, "Should be 1 copy");

        let number = await db.returnNumOfItemsInBasket(userID);
        chai.assert.equal(number, 1, "Should be 1 item in basket");

        await db.checkout(userID);

        number = await db.returnNumOfItemsInBasket(userID);
        chai.assert.equal(number, 0, "Should be no items in basket");

        basketItems = await db.getAllItemsInBasket(userID);
        chai.assert.isEmpty(basketItems, "should be no items in basket");

        db.deleteTestOrder(userID, bookID);
    });

    test("Test Retrieving Test Orders", async function (){
        let deliveredOrderID = "610ef13862268f40b47c1a7b";
        let awaitingOrderID = "610ef25ff6ae833968c40b06";

        let awaitingOrder = await db.getSelectedOrder("610ef13862268f40b47c1a7b");
        let deliveredOrder = await db.getSelectedOrder("610ef25ff6ae833968c40b06");

        chai.assert.equal(awaitingOrder.getOrderID(),"610ef25ff6ae833968c40b06", "Order id should be the same unless it has been deleted");
        chai.assert.eqal(awaitingOrder.getOrderStatus(), "Awaiting", "Status should be awaiting (unless it has been processed)");

        chai.assert.equal(deliveredOrder.getOrderID(),"610ef13862268f40b47c1a7b", "Order id should be the same unless it has been deleted");
        chai.assert.eqal(deliveredOrder.getOrderStatus(), "Delivered", "Status should be delivered");
    });

});




