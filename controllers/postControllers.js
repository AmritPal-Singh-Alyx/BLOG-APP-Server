const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpsError = require("../models/errorModel");



// ****************** Create a Post ******************

// POST: api/posts
// UnProtected

const createPost = async (req, res, next) => {

    try {

        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpsError("Fill all the fields", 422));
        };

        let { thumbnail } = req.files;
        // check the file size is greater than 2mb
        if (thumbnail.size > 2000000) {
            return next(new HttpsError("File too big. File should be less than 2mb"), 422);
        };

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split(".");
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
            if (err) {
                return next(new HttpsError(err));
            } else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.id });
                if (!newPost) {
                    return next(new HttpsError("Post couldn't be created", 422));
                };

                // find the user and increment the post by +1
                const currentUser = await User.findById(req.user.id);
                const userCountPost = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userCountPost });

                res.status(201).json(newPost)
            };
        })


    } catch (error) {

        return next(new HttpsError(error));

    };
};








// ****************** Get all Posts ******************

// GET : api/posts
// Protected

const getPosts = async (req, res, next) => {

    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {

        return next(new HttpsError(error))

    }
};







// ****************** Get single Post ******************

// GET : api/posts/:id
// UnProtected

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpsError("Post not found", 404));
        }

        res.status(200).json(post);

    } catch (error) {
        return next(new HttpsError("Invalid Link. Please check again"));
    };
};









// ****************** Gte post by Category ******************

// GET : api/posts/categories/:category
// UnProtected

const getCatPosts = async (req, res, next) => {
    try {

        const category = req.params.category;
        const postCat = await Post.find({ category }).sort({ createdAt: -1 });
        if (!postCat) {
            return next(new HttpsError("Post Category not Found", 404))
        }
        res.status(200).json(postCat);

    } catch (error) {
        return next(new HttpsError(error));
    };
};








// ****************** Get post by autthor/user ******************

// GET : api/posts/user/:id
// UnProtected

const getUserPosts = async (req, res, next) => {
    try {

        const { id } = req.params;
        const userPosts = await Post.find({ creator: id }).sort({ createdAt: -1 });

        res.status(200).json(userPosts);

    } catch (error) {
        return next(new HttpsError("Invalid Link."))
    }
};







// ****************** Edit Post ******************

// PATCH : api/posts/:id
// Protected

const editPost = async (req, res, next) => {

    try {
        let fileName;
        let newFilename;
        let updatedPost;
        let postId = req.params.id;

        let { title, category, description } = req.body;
        // Reactquill has  a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already.
        if (!title || !category || description < 12) {
            return next(new HttpsError("Fill all the fields", 422));
        };

        const oldPost = await Post.findById(postId);
        if (req.user.id == oldPost.creator) {

            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
            } else {
                // Deleting old thumbnail from the post
                fs.unlink(path.join(__dirname, "..", "uploads", oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpsError(err));
                    }
                })
                //upload new Thumbnail
                const { thumbnail } = req.files;
                // checking file size
                if (thumbnail.size < 2000000) {
                    return next(new HttpsError("File size is too big. Should be less than 2mb", 422));
                }

                fileName = thumbnail.name;
                let splittedName = fileName.split(".");
                let newFilename = splittedName[0] + uuid() + "." + splittedName[splittedName.length - 1];
                thumbnail.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
                    if (err) {
                        return next(new HttpsError(err));
                    };
                })

                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true });
            }
        }

        if (!updatedPost) {
            return next(new HttpsError(" couldn't be created", 400));
        };

        res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpsError(error));
    };

};




// ****************** Edit Post ******************

// DELETE : api/posts/:id
// Protected

const deletePost = async (req, res, next) => {

    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpsError("Post Unavailable", 400));
        };

        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {
            // Delete the Thumbnail from the uploads folder
            fs.unlink(path.join(__dirname, "..", "uploads", fileName), async (err) => {
                if (err) {
                    return next(new HttpsError(err));
                } else {
                    await Post.findByIdAndDelete(postId);

                    // find user and reduce the post count by -1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                    res.json(`Post of ${postId} has been Deleted`);
                }
            })
        } else {
            return next(new HttpsError("Post couldn't be deleted", 403))
        }
    } catch (error) {
        return next(new HttpsError(error));
    }
};


module.exports = { createPost, getPost, getCatPosts, getPosts, getUserPosts, editPost, deletePost };