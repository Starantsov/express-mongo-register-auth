const express = require("express");
const routes = require("./router/index.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const app = express();


mongoose.connect("mongodb://localhost:27017/darktheme",{useNewUrlParser: true});
const db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(session({
    secret:"Star",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));

app.set("view engine", "pug");
app.set('views', __dirname + '/views');

app.use(function(req, res, next){
    res.locals.currentUser = req.session.userId;
    next();
});

app.use("/", routes);

app.use((req, res, next) => {
    const error = new Error(`${req.url} is Not found`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message
    });
})

const port = 1338;
app.listen(port, () => console.log(`Server is running on port ${port}`));