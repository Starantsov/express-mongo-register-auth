const route = require("express").Router();
const User = require("../models/user");

route.use(function(req, res, next){
    User.getName(req.session.userId,(error, username) => {
        res.locals.uname = username;
        next();
    })
})
route.get("/", (req, res) => {
    res.render("index");
});
route.get("/theme", (req, res) => {
    const theme = req.cookies.theme;
    res.send(theme);
});
route.post("/", (req, res) => {
    const theme = req.body.theme;
    res.cookie("theme", theme , { expires: new Date(Date.now() + 10e8)});
    res.end();
});

route.get("/register", (req, res) => {
    res.render("register");
})
route.post('/register', (req, res, next) => {
   if(req.body.password !== req.body.checkPassword){
       next(new Error("Passwords should match!"));
   }else{
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };
        User.create(userData, (error, user) => {
            if(error){
                //Form a response for ajax to render error message with client js
                if(error.code === 11000){
                    return next(new Error("That email already registered!"));
                }else{
                    next(error);
                }
            }
            req.session.userId = user._id;
            return res.redirect('/');//Form a response for ajax to render error message with client side js
        });
   }
});
route.get("/sign", (req, res) => {
    res.render('sign');
})
route.post("/sign", (req, res, next) => {
    User.authenticate(req.body.email, req.body.password, function(err, user){
        if(!user) return next(new Error("User not found!"));
        if(err) return next(err);

        req.session.userId = user._id;
        return res.redirect("/");    
    });
})
route.get("/logout", (req, res, next) => {
    if(req.session){
        req.session.destroy(function(err){
            if(err)return next(err);
            return res.redirect('/');
        })
    }
})
route.get("/api/:col",(req, res, next) => {
    if(req.params.col.toLocaleLowerCase() === "users"){
        User.find({},function(err, users){
            return res.json(users);
        });
    }else{
        res.send(`<h1>Collection '${req.params.col}' does not exist`);
    }
})

module.exports = route;