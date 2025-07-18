import crypto from "crypto"
const generateOtp = async (email) => {
    try {
        const otp = crypto.randomInt(100000, 1000000).toString().padStart(6, '0');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        return { otp, expiresAt };
    } catch (error) {
        console.error(`Error generating OTP: ${error}`);
        throw new Error('Failed to generate OTP');
    }
};

module.exports = generateOtp;
