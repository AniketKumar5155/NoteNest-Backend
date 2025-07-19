// models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const config = require('../config/config.cjs');
const UserModel = require('./user.js');
const TokenModel = require('./token.js');
const OtpModel = require('./otp.js');
const NoteModel = require('./note.js'); // if you have it

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// Init all models
const User = UserModel(sequelize);
const Token = TokenModel(sequelize);
const Otp = OtpModel(sequelize);
const Note = NoteModel(sequelize);

// Setup associations
User.associate?.({ Token, Otp, Note }); 
Token.associate?.({ User });
Otp.associate?.({ User });
Note.associate?.({ User });

module.exports = {
  sequelize,
  Sequelize, 
  User,
  Token,
  Otp,
  Note,
};

