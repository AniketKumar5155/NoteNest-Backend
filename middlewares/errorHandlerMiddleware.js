const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode;
    return res.status(statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
        errordata: err

    })
}

export default errorHandlerMiddleware