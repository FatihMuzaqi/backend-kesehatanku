import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import KategoriKesehatan from './kategori-kesehatan.js';

// Definisi Model Artikel
const Artikel = db.define('artikel', {
    kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'kategori_kesehatan', // Nama tabel, bukan model JS
        key: 'id',
        },
    },
    images: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isi: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('publish', 'draft'),
        allowNull: false,
    },
    }, {
    tableName: 'artikel',
    timestamps: true,
    });

export default Artikel;
