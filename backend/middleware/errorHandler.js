const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // VARNING VARNING HÄR HAR VI ERRORS! :D

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        error: err.message || "Something went wrong"
    });
};

export default errorHandler;
