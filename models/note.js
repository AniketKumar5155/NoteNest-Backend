const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Note extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: "user_id",
                onDelete: "CASCADE",
            });
        }
    }

    Note.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: DataTypes.TEXT(`long`),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT(`long`),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(20),  //optional
            defaultValue: '#d3d3d3',
        },
        category: {
            type: DataTypes.STRING(100), // optional
            allowNull: true,
        },
        is_pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: "Note",
        tableName: "notes",
        underscored: true,
        timestamps: false
    });

    return Note;
};

