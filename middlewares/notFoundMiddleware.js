const notFoundMiddleware = (err, req, res) => {
    return res.status(404).json({
        success: false,
        message: `route ${req.originalUrl} not found`
    });
};

export default notFoundMiddleware;