const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, pelase try again later"
});

module.exports = limiter;