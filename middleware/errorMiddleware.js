// Unsupported (404) routes

const notFound = (res, req, next) => {

    const error = new Error(`not found - ${req.originalUrl}`);

    res.status(404);
    next(error);

};

// Middleware to handle the errors

const errorHandler = (error, res, req, next) => {
    if (res.headerSent) {
        return next(error);
    };
    res.status(error.code || 500).json({ message: error.message || " An unknown error occurred" })
};


module.exports = { notFound, errorHandler };