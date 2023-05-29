const User = require("../models/User")
const app = require("../app")

const isAuthenticated = async (req, res, next) => {
    if (req.session.userId){
        const user = await User.findById(req.session.userId)
        if (user){
            next()
        }
        else{
            res.redirect("/auth/login")
        }
    }else{
        res.redirect("/auth/login")
    }
}
const notAuthenticated = (req, res, next) => {
    if(!req.session.userId){
        next()
    }
    else{
        res.redirect("/")
    }
}
module.exports = {isAuthenticated,  notAuthenticated}