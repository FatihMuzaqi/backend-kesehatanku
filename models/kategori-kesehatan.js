import { DataTypes } from 'sequelize';
import db from '../config/db.js'; // Pastikan ini mengarah ke file konfigurasi database kamu

// Definisikan model 'KategoriKesehatan'
const KategoriKesehatan = db.define('kategori_kesehatan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Menggunakan auto increment untuk id
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama_kategori: {
        type: DataTypes.STRING(100),
        allowNull: false, // Nama kategori tidak boleh null
        unique: true, // Nama kategori harus unik
    },
    deskripsi: {
        type: DataTypes.TEXT, //console.log('Model KategoriKesehatan defined');console.log('Model KategoriKesehatan defined'); Deskripsi menggunakan tipe TEXT untuk menyimpan teks panjang
    },
}, {
  tableName: 'kategori_kesehatan', // Nama tabel di database
  timestamps: true
});

// Export model untuk digunakan di bagian lain aplikasi
export default KategoriKesehatan;
