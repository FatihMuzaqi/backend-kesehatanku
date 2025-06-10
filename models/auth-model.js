import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.js";

// Model Role
const Roles = db.define("roles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Model User
const Users = db.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Roles,
            key: "id",
        },
    },
    refresh_token:{
        type:DataTypes.TEXT
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
        }

}, {
    freezeTableName: true
});

Roles.hasMany(Users, { foreignKey: "roleId" });
Users.belongsTo(Roles, { foreignKey: "roleId" });

export { Users, Roles };
