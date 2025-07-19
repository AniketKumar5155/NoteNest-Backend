const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Otp extends Model {
    static associate(models) {
      // If you want to define the relationship later
    }
  }

  Otp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Otp",
      tableName: "otps",
      underscored: true,
      timestamps: false,
    }
  );

  return Otp;
};
