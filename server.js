let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let session = require('express-session');
let bcrypt = require ('bcrypt');
let multer = require('multer');

//IMPORT ROUTES
let routes = require("./Routes");

//IMPORT CONTROLLERS
let bookController = require("./Controller/Book-Controller");
let accountController = require("./Controller/Account-Controller");
let basketController = require("./Controller/Basket-Controller");
let chatController = require("./Controller/Chat-Controller");

//CONFIGURE EXPRESS APP
let app = new express();
//CONFIGURE SERVER
let server = http.createServer(app);

//SOCKET.IO FUNCTIONALITY
let io = socketIo(server,{
    cors: {
        origin: "http://localhost:9000",
        methods: ["GET", "POST"]
    }
});

//CONFIGURE EXPRESS APP TO USE STATIC RESOURCES
app.use(express.static(path.join(__dirname, "resources")));

//SET APP UP TO USE EJS TEMPLATES
app.set("views", path.join(__dirname, "Public"));
app.set("view engine", "ejs");

//SET UP STATIC FILES
app.use(express.static(path.join(__dirname, "resources")));

//SET UP SESSION USAGE
let secretSesh = bcrypt.hashSync("secret", 10);
let sesh;
app.use(session({
    secret: secretSesh
}));

//FOR UPLOADING PICTURES
let storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, './resources/images');//Image File Location
    },

    //Reattach file extension .jpg or .png
    filename: function(request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage:storage });

//ENABLE PROCESSING OF POST FORMS
app.use(express.urlencoded({extended: true}));

//GET REQUESTS for USERS
app.get("/welcome", routes.loadWelcomePage);
app.get("/Login_or_Register", routes.loadLoginOrRegisterPage);
app.get("/User_Login", routes.loadUserLoginPage);
app.get("/User_Register", routes.loadUserRegisterPage);
app.get("/User_Home", routes.loadUserHomePage);

//GET REQUESTS for ADMIN
app.get("/Add_Book", routes.loadAddBookPage);
app.get("/View_All_Stock", routes.loadViewAllStockPage);
app.get("/View_Basket", routes.loadBasketPage);
app.get("/Employee_Customer_Support", routes.loadEmployeeChatRoom);

//GET REQUEST TO VIEW STOCK BOOK
app.get("/View_Stock_Book/:bookId", routes.loadViewStockBookPage);

app.post("/addBook", upload.single("imgCover"), (request, response) => {
    if(request.file) {bookController.addBook(request,response,request.file.filename);}
});

//FORM POST REQUEST to update cover image of existing book
app.post("/updateBookImg", upload.single("imgName"), (request, response) => {
    if(request.file) {bookController.updateBookImage(request,response,request.file.filename);}
});

//FORM POST REQUEST update book
app.post("/updateBook", bookController.updateBook);

//FORM POST REQUEST register account
app.post("/registerAccount", accountController.createAccount);

//FORM POST REQUEST to login
app.post("/checkLogin", accountController.login);

//GET REQUESTS for customers
app.get("/View_All_Books", routes.loadViewAllBookItemsPage);
app.get("/Contact_Shop", routes.loadCustomerSupportPage);


let currentUser = "";
//GET REQUEST to save user id as session after successful login
app.get("/User_Home/:userID", function(request,response){
    sesh=request.session;
    sesh.user = request.params.userID;
    currentUser = sesh.user;
    response.redirect("/User_Home");
});

//GET REQUEST to remove an item from basket
app.get("/Remove_Basket/:itemID",function(response, request){
    basketController.removeItemFromBasket(request.session.user, request, response);
});

//GET REQUEST TO VIEW BOOK as customer
app.get("/View_Book/:bookId", routes.loadViewBookPage);

//FORM POST REQUEST to add item to basket
app.post("/addToBasket", routes.addToBasket);

//WEB SOCKET
io.on("connection", function(socket){

    //Wait for someone to send a message
    socket.on("send message", function(msg, recipient, sender, timestamp){
        //Log message
        chatController.logMessage(sender,recipient,msg,timestamp);

        //Emit by server to find which chatroom message should be sent to
        socket.broadcast.emit("received message" , msg, recipient, sender, timestamp);

    });

});

//RUN THE SERVER ON PORT 9000
let port = 9000;

server.listen(port, function(){
    console.log("Listening on port:" + port);
});

module.exports.app = app;