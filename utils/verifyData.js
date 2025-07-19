const bcrypt = require('bcryptjs');

const verifyData = async (data, hashedData) => {
    const verifiedData = await bcrypt.compare(data, hashedData);
    return verifiedData;
};

module.exports = verifyData;
