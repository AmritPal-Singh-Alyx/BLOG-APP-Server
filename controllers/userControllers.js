// importing the error Model to handle the errors
const HttpsError = require("../models/errorModel");


// importing the schema from userModel
const User = require("../models/userModel");

// importing bcrypt to hash the password
const bcrypt = require("bcryptjs");

// importing jsonWebToken
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

// importing uuid for random string
const { v4: uuid } = require("uuid");











// +++++++++++++++++ Resgister a New user +++++++++++++++++
// POST : api/users/register
// Unprotected

const registerUser = async (req, res, next) => {

    try {

        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password) {
            return next(new HttpsError("Fill all the fields."), 422);
        };

        const newEmail = email.toLowerCase();

        const emailExist = await User.findOne({ email: newEmail });
        if (emailExist) {
            return next(new HttpsError("Email already exist!"), 422);
        };

        if ((password.trim()).length < 6) {
            return next(new HttpsError("Password should be atleast 6 characters or more"), 422);
        };

        if (password != password2) {
            return next(new HttpsError("Password do not match", 422));
        };


        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });

        res.status(201).json(newUser);

    } catch (error) {
        return next(new HttpsError(" User registration failed.", 422))

    }
}













// +++++++++++++++++ Login a Registered user +++++++++++++++++
// POST : api/users/login
// Unprotected


const loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpsError("Please fill the Details"), 422);
        };

        const newEmail = email.toLowerCase();

        const emailExist = await User.findOne({ email: newEmail });
        if (!emailExist) {
            return next(new HttpsError("Invalid Credentials!"), 422);
        };

        const comparePass = await bcrypt.compare(password, emailExist.password);
        if (!comparePass) {
            return next(new HttpsError("Invalid Credentials!"), 422);
        };

        const { _id: id, name } = emailExist;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, id, name });


    } catch (error) {
        return next(new HttpsError("Login Failed. Please check your credentials!"), 422);
    };

};











// +++++++++++++++++ User Profile +++++++++++++++++
// POST : api/users/:id
// Protected

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Fetching user with ID: ${id}`);  // Debugging log

        // Validate the ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`Invalid User ID format: ${id}`);
            return next(new HttpsError("Invalid User ID format", 422));
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            console.log(`User not found: ${id}`);
            return next(new HttpsError("User not found", 404));
        };
        res.status(200).json(user);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return next(new HttpsError("Server Error. Unable to fetch user", 500));
    };
};













// +++++++++++++++++ Change User Avatar +++++++++++++++++
// POST : api/users/change-avatar
// Protected

const changeAvatar = async (req, res, next) => {

    try {
        if (!req.files.avatar) {
            return next(new HttpsError("Please upload an image", 422));
        };

        // find the User from database
        const user = await User.findById(req.user.id);

        //Delete the avatart if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
                return next(new HttpsError(err));
            });
        };

        const { avatar } = req.files;
        if (avatar.size > 500000) {
            return next(new HttpsError("The file size is too big. should be less than 500kb"), 422)
        }

        // change the file name if they have same name
        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split('.');
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        avatar.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
            if (err) {
                return next(new HttpsError(err));
            };
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });
            if (!updatedAvatar) {
                return next(new HttpsError(" Avatar couldn't be changed"), 422);
            };
            res.status(200).json(updatedAvatar);
        });


    } catch (error) {
        return next(new HttpsError(error));
    };
};













// +++++++++++++++++ Edit User Details (from profile) +++++++++++++++++
// POST : api/users/edit-user
// Protected

const editUser = async (req, res, next) => {
    try {

        const { name, email, currentPassword, newPassword, newConfirmPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword || !newConfirmPassword) {
            return next(new HttpsError("Fill all the fields", 422));
        };

        // get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpsError("User not found", 403));
        };

        // makesure new email doesn't already exist
        const emailExist = await User.findOne({ email });
        // we want to update other details with/without changing the email (which is a unique id because we use it  to login ).
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpsError("Email already exist"), 422);
        };

        //compare current password and new password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpsError(" Invalid current password", 422));
        };

        //compare new password
        if (newPassword !== newConfirmPassword) {
            return next(new HttpsError("New passwords do not match", 422))
        }

        // hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // update the user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true });

        res.status(200).json(newInfo);


    } catch (error) {
        return next(new HttpsError(error));
    };
};












// +++++++++++++++++ GET Auhtors +++++++++++++++++
// POST : api/users
// UnProtected

const getAuthors = async (req, res, next) => {

    try {
        const authors = await User.find().select("-password");
        res.json(authors)
    } catch (error) {
        return next(new HttpsError(error));
    };
};


module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors };