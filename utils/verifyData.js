import bcrypt from "bcryptjs";

const verifyData = async (data, hashedData) => {
    const verifiedData = await bcrypt.compare(data, hashedData);
    return verifiedData;
};

export default verifyData;
