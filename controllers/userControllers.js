// importing the error Model to handle the errors
const HttpError = require("../models/errorModel");

// importing the schema from userModel
const User = require("../models/userModel");

// importing bcrypt to hash the password
const bcrypt = require("bcryptjs");




// +++++++++++++++++ Resgister a New user +++++++++++++++++
// POST : api/users/register
// Unprotected

const registerUser = async (req, res, next) => {

    try {

        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password) {
            return next(new HttpError("Fill all the fields."), 422);
        };

        const newEmail = email.toLowerCase();

        const emailExist = await User.findOne({ email: newEmail });
        if (emailExist) {
            return next(new HttpError("Email already exist!"), 422);
        };

        if ((password.trim()).length < 6) {
            return next(new HttpError("Password should be atleast 6 characters or more"), 422);
        };

        if (password != password2) {
            return next(new HttpError("Password do not match", 422));
        };


        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });

        res.status(201).json(newUser);

    } catch (error) {
        return next(new HttpError(" User registration failed.", 422))

    }
}



// +++++++++++++++++ Login a Registered user +++++++++++++++++
// POST : api/users/login
// Unprotected


const loginUser = async (req, res, next) => {
    res.json(" Login user")
};



// +++++++++++++++++ User Profile +++++++++++++++++
// POST : api/users/:id
// Protected

const getUser = async (req, res, next) => {
    res.json(" User Profile")
}



// +++++++++++++++++ Change User Avatar +++++++++++++++++
// POST : api/users/change-avatar
// Protected

const changeAvatar = async (req, res, next) => {
    res.json("Change avatar");
}



// +++++++++++++++++ Edit User Details (from profile) +++++++++++++++++
// POST : api/users/edit-user
// Protected

const editUser = async (req, res, next) => {
    res.json("Edit User Details")
}


// +++++++++++++++++ GET Auhtors +++++++++++++++++
// POST : api/users/authors
// UnProtected

const getAuthors = async (req, res, next) => {
    res.json("Get all users/Authors")
}


module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors };