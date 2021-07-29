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

//GET REQUESTS for USERS
app.get("/welcome", routes.loadWelcomePage);
app.get("/Login_or_Register", routes.loadLoginOrRegisterPage);
app.get("/User_Login", routes.loadUserLoginPage);
app.get("/User_Register", routes.loadUserRegisterPage);

//GET REQUESTS for ADMIN
app.get("/Add_Book", routes.loadAddBookPage);
app.get("/View_All_Stock", routes.loadViewAllStockPage);

//GET REQUEST TO VIEW STOCK BOOK
app.get("/View_Stock_Book/:bookId", routes.loadViewStockBookPage);

//POST REQUEST add book
app.post("/addBook", upload.single("imgCover"), (request, response) => {
    if(request.file) {
        bookController.addBook(request,response,request.file.filename);
    }
});

//RUN THE SERVER ON PORT 9000
let port = 9000;

server.listen(port, function(){
    console.log("Listening on port:" + port);
});

module.exports.app = app;