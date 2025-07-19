// models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const UserModel = require('./user.js');
const TokenModel = require('./token.js');
const OtpModel = require('./otp.js');
const NoteModel = require('./note.js'); // if you have it

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
  }
);

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

