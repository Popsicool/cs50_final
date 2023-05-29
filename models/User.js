const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
userSchema.pre("save",async function (next){
    if (!this.isModified("password")) {
        return next()
    }
    try {
        // console.log(this.password)
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        console.log(this.password)
        return next()
    } catch (error) {
        console.log(error)
    }
    })

const User = mongoose.model("User", userSchema)

module.exports = User