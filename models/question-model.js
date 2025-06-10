import { DataTypes } from "sequelize";
import db from "../config/db.js";
import KategoriKesehatan from "./kategori-kesehatan.js";

const questions = db.define("questions", {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kategori_id: {
        type: DataTypes.INTEGER,
        references: {
            model: KategoriKesehatan, // referensi dari tabel kategori 
            key: "id",
        }
    },
    name_symptom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "questions",
    timestamps: true
});


KategoriKesehatan.hasMany(questions, { foreignKey: "kategori_id" });


export default questions;