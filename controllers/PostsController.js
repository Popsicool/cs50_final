const path = require("path")
const Post = require("../models/Post")
const fs = require("fs")
const app = require("../app")
const User = require("../models/User")
const showHomePage = async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {posts})
}
const createPost = (req, res) => {
    res.render("create-post")
}

const storePost = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        const userName = user.username
        if (req.files){
            const image = req.files.image
            const num = Math.floor(Math.random() * 10000)
            const file_name = userName + num + image.name
            await image.mv(path.resolve(__dirname, '..', 'public/posts', file_name))
            await Post.create({
                ...req.body,
                userName,
                image: `/posts/${file_name}`
            })
        }
        else{
            await Post.create({
                ...req.body,
                userName
            })
        }
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
}
const showPost = async (req,  res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.render('post', {post})
    } catch (error) {
        res.redirect("/")
    }
}
const editPost = async (req, res)  => {
    const id = req.params["id"]
    const post = await Post.findById(id)
    console.log(req.session.user.username)
    if (req.session.user.username !== post.userName){
        res.redirect("/")
    }
    else{
        let update = {}
        if (req.files){
            if (post.image !== undefined){
                fs.unlink(`./public/${post.image}`,  (err) => {
                    console.log(err)
                })
            }
            const image = req.files.image
            const num = Math.floor(Math.random() * 10000)
            const file_name = req.session.user.username + num + image.name
            await image.mv(path.resolve(__dirname, '..', 'public/posts', file_name))
            update = await {...req.body, image: `/posts/${file_name}`}
        }
        else{
            update = {...req.body}
        }
        await Post.updateOne({_id: id}, {$set: update})
        await res.redirect("/")

    }
}

const editPostShow = async (req, res) => {
    const id = req.params["id"]
    const post = await Post.findById(id)
    if (req.session.user.username !== post.userName){
        res.redirect("/")
    }
    else{
        res.render("editpost", {post})

    }
}

const deletePost = async (req, res) => {
    const id = req.params["id"]
    const post = await Post.findById(id)
    if (req.session.user.username !== post.userName){
        res.redirect("/")
    }
    else{
        if (post.image !== undefined){
            fs.unlink(`./public/${post.image}`,  (err) => {
                console.log(err)
            })
        }
        await Post.deleteOne({_id: id})
        res.redirect("/")

    }
}

module.exports =  {
    showHomePage, createPost, storePost,
    showPost,  editPost, editPostShow,
    deletePost
}