const User = require("../models/User")
const bcrypt = require("bcrypt")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const createUser = (req, res) => {
    res.render("register")
}
const storeUser = async (req, res) => {
    const email_exist = await User.findOne({email: req.body.email})
    const username_exist = await User.findOne({username: req.body.username})
    if (username_exist){
        console.log("User with username already exist")
        res.redirect("/auth/register")
    }
    else if (email_exist){
        console.log("User with email already exist")
        res.redirect("/auth/register")
    }
    else{
        let user = new User({
            ...req.body
        })
        try {
            user.save()
            res.redirect("/")
        } catch (error) {
            console.log(error)
            res.redirect("/auth/register")
        }
    }
}
const loginPage = (req, res) => {
    res.render("login")
}
const login = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (!user){
        console.log("User does not  exist")
        res.redirect("/auth/login")
    }
    else{
        const use = await bcrypt.compare(req.body.password, user.password)
        if (use){
            req.session.userId = user._id
            req.session.user = user
            res.redirect("/")
        }
        else{
            console.log("Invalid password")
            res.redirect("/auth/login")
        }
    }
}
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}
module.exports = {createUser, storeUser, loginPage, login, logout}