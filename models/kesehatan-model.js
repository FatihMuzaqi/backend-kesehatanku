import { Sequelize, DataTypes } from "sequelize";
import db from '../config/db.js';
import KategoriKesehatan from './kategori-kesehatan.js';

const Kesehatan = db.define('kesehatan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        references: {
        model: KategoriKesehatan,
        key: 'id',
        },
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
    },
    saran: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    }, {
    tableName: 'kesehatan',
    timestamps: true,
    });

Kesehatan.belongsTo(KategoriKesehatan, { foreignKey: 'id_kategori' });

export default Kesehatan;
