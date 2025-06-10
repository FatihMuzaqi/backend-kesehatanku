import { DataTypes } from 'sequelize';
import db from '../config/db.js'; // Pastikan ini mengarah ke file konfigurasi database kamu
import KategoriKesehatan from './kategori-kesehatan.js';
import Penyakit from './penyakit-model.js';

// Definisikan model 'KonsultasiPenyakit'
const KonsultasiPenyakit = db.define('konsultasi', {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
        pengguna_id: {
        type: DataTypes.INTEGER, // Asumsi ada tabel pengguna yang memiliki id
        allowNull: false,
        },
        gambar_penyakit: {
        type: DataTypes.STRING(255), // Menyimpan path gambar
        allowNull: false,
        },
        hasil_prediksi: {
        type: DataTypes.TEXT, // Hasil dari prediksi model ML
        allowNull: false,
        },
        kategori_id: {
        type: DataTypes.INTEGER,
        references: {
            model: KategoriKesehatan,
            key: 'id',
        },
        allowNull: false,
        },
        penyakit_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Penyakit,
            key: 'id',
        },
        allowNull: false,
        },
        tanggal_konsultasi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'konsultasi',
        timestamps: true,
    });
    
    KategoriKesehatan.hasMany(Penyakit, {
        foreignKey: 'kategori_id',
    });
    Penyakit.belongsTo(KategoriKesehatan, {
        foreignKey: 'kategori_id',
    });

    KategoriKesehatan.hasMany(KonsultasiPenyakit, {
        foreignKey: 'kategori_id',
    });
    KonsultasiPenyakit.belongsTo(KategoriKesehatan, {
        foreignKey: 'kategori_id',
    });

    
    // Relasi Penyakit ke Konsultasi
    Penyakit.hasMany(KonsultasiPenyakit, {
        foreignKey: 'penyakit_id',
    });
    KonsultasiPenyakit.belongsTo(Penyakit, {
        foreignKey: 'penyakit_id',
    });
    
export default KonsultasiPenyakit;
