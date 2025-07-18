// models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';
import TokenModel from './token.js';
import OtpModel from './otp.js';
import NoteModel from './note.js'; // if you have it

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
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

export {
  sequelize,
  Sequelize, 
  User,
  Token,
  Otp,
  Note,
};

