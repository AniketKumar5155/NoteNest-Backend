const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const config = require('../config/config.cjs');

const UserModel = require('./user.js');
const TokenModel = require('./token.js');
const OtpModel = require('./otp.js');
const NoteModel = require('./note.js');
const CategoryModel = require('./category.js');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const User = UserModel(sequelize, Sequelize.DataTypes);
const Token = TokenModel(sequelize, Sequelize.DataTypes);
const Otp = OtpModel(sequelize, Sequelize.DataTypes);
const Note = NoteModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes); // ✅ fixed this line

User.associate?.({ Token, Otp, Note, Category });
Token.associate?.({ User });
Otp.associate?.({ User });
Note.associate?.({ User, Category });
Category.associate?.({ User, Note });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Token,
  Otp,
  Note,
  Category,
};
