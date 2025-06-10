import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { Users } from "./auth-model.js";
import Artikel from "./artikel-model.js";

const reactions = db.define("reactions", {
    like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: "id"
        }
    },
    artikel_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Artikel,
            key: "id"
        }
    },
    status: {
        type: DataTypes.ENUM("like", "dislike"),
        allowNull: false
    }
}, {
    tableName: "reactions",
    timestamps: true
});

Users.hasMany(reactions, { foreignKey: "user_id" });
Artikel.hasMany(reactions, { foreignKey: "artikel_id" });

export  { reactions };