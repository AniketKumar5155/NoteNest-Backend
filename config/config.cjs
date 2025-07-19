require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = isProd
  ? {
      use_env_variable: 'NETLIFY_DATABASE_URL',
      dialect: 'postgres',
      dialectModule: require('pg'),
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  : {
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASS || null,
      database: process.env.DB_NAME || "your_db_name",
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "mysql",
      dialectModule: require('mysql2'),
    };
