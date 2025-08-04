const jwt = require('jsonwebtoken');

const generateTokens = async ({userId, email, username}) => {
    try {
        const payload = { userId, email, username }
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
            expiresIn: "10d"
        });
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, {
            expiresIn: "7d"
        });

        return { accessToken, refreshToken }
    } catch (error) {
        // console.error(`Error generating access and refresh token: ${error}`);
        throw new Error("Failed to generate access and refresh token");
    };
};

module.exports = generateTokens;