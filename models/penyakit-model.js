import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import KategoriKesehatan from './kategori-kesehatan.js';

const Penyakit = db.define('penyakit', {
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
    judul_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATE,
    },
    }, {
    tableName: 'penyakit',
    timestamps: true,
    });

Penyakit.belongsTo(KategoriKesehatan, { foreignKey: 'id_kategori' });

export default Penyakit;
