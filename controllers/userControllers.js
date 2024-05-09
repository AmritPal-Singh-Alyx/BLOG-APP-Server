// +++++++++++++++++ Resgister a New user +++++++++++++++++
// POST : api/users/register
// Unprotected

const registerUser = (res, req, next) => {

    res.json("Register User")
}



// +++++++++++++++++ Login a Registered user +++++++++++++++++
// POST : api/users/login
// Unprotected


const loginUser = (res, req, next) => {
    res.json(" Login user")
};



// +++++++++++++++++ User Profile +++++++++++++++++
// POST : api/users/:id
// Protected

const getUser = (res, req, next) => {
    res.json(" User Profile")
}



// +++++++++++++++++ Change User Avatar +++++++++++++++++
// POST : api/users/change-avatar
// Protected

const changeAvatar = (res, req, next) => {
    res.json("Change avatar");
}



// +++++++++++++++++ Edit User Details (from profile) +++++++++++++++++
// POST : api/users/edit-user
// Protected

const editUser = (res, req, next) => {
    res.json("Edit User Details")
}


// +++++++++++++++++ GET Auhtors +++++++++++++++++
// POST : api/users/authors
// UnProtected

const getAuthors = (res, req, next) => {
    res.json("Get all users/Authors")
}


module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors };