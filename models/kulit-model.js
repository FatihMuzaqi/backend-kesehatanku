import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import KategoriKesehatan from './kategori-kesehatan.js';

const Kulit = db.define('kulit', {
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
    tableName: 'kulit',
    timestamps: true,
    });

Kulit.belongsTo(KategoriKesehatan, { foreignKey: 'id_kategori' });

export default Kulit;
