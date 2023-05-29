const express = require('express');
const app = express();
const engine = require('express-edge');
const port = 3000
const {showHomePage, createPost, storePost,
    showPost,editPost, editPostShow, deletePost} = require('./controllers/PostsController')
const {createUser, storeUser, loginPage, login, logout} = require('./controllers/UserController')
const db = require('./db')
const fileUpload = require("express-fileupload")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const {isAuthenticated, notAuthenticated} = require("./middlewares/auth")
const User = require("./models/User")
const edge = require("edge.js")


app.use(express.static('public'))
app.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/nodeblog"
    })
}))


app.use("*", async (req, res, next) => {
    if(req.session.userId){
        const userId = req.session.userId
        const user = await User.findById(userId)
        app.locals = {"user": user, "userId": userId}
        // app.locals()
        next()
    }
    else{
        app.locals = {}
        next()
    }
})
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())
app.use(engine);
app.set('views', `${__dirname}/views`);

app.get('/', showHomePage);
app.get("/posts/new",isAuthenticated, createPost)
app.post("/posts/store", storePost)
app.get('/posts/:id', showPost)
app.get("/auth/register",notAuthenticated, createUser)
app.post("/auth/register",notAuthenticated, storeUser)
app.get("/auth/login", notAuthenticated, loginPage)
app.post("/auth/login",notAuthenticated, login)
app.get("/edit/:id", isAuthenticated, editPostShow)
app.post("/edit/:id",isAuthenticated, editPost)
app.get("/delete/:id",isAuthenticated, deletePost)
app.get("/auth/logout", logout)
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})