import bcrypt from "bcryptjs";

const hashData = async (data) => {
    try {
        const SALT_ROUND = 10;
        const hashedData = await bcrypt.hash(data, SALT_ROUND)

        return hashedData
    } catch (error) {
        console.error(`Error hashing password: ${error.message}`);
        throw new Error("Failed to hash password");
    }
};

module.exports = hashData;
