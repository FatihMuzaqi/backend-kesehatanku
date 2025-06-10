import KategoriKesehatan from "../models/kategori-kesehatan.js";
import { Op } from "sequelize";
import path from "path";
import fs from 'fs';
import md5 from 'md5';;

export const getKategori = async () => {
    const data = await KategoriKesehatan.findAll();
    return data;
}

/**
 * Fungsi untuk menyimpan kategori kesehatan baru beserta gambar (jika ada)
 * @param {Object} data - Data kategori
 * @param {string} data.nama_kategori
 * @param {string} data.deskripsi
 * @param {Object|null} data.file - File gambar dari payload, bisa null
 * @param {string} baseUrl - URL dasar server untuk membangun URL gambar
 * @returns {Object} kategori baru yang sudah disimpan
 */
export const addKategoriService = async ({ nama_kategori, deskripsi, file }, baseUrl) => {
    const existing = await KategoriKesehatan.findOne({ where: { nama_kategori } });
    if (existing) {
        throw new Error('Nama kategori sudah digunakan');
    }

    let imageUrl = null;

    if (file && file.hapi) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024;

        const contentType = file.hapi.headers['content-type'];
        if (!allowedTypes.includes(contentType)) {
        throw new Error('Format gambar tidak valid (harus jpg/jpeg/png)');
        }

        if (file._data.length > maxSize) {
        throw new Error('Ukuran gambar maksimal 5MB');
        }

        const ext = path.extname(file.hapi.filename);
        const hashName = md5(file.hapi.filename + Date.now());
        const fileName = `${hashName}${ext}`;
        const dirPath = path.join('public', 'images', 'kategori');

        if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, fileName);
        fs.writeFileSync(filePath, file._data);

        imageUrl = `${baseUrl}/images/kategori/${fileName}`;
    }

    // Simpan ke database
    const newKategori = await KategoriKesehatan.create({
        nama_kategori,
        deskripsi,
        images: imageUrl,
    });

    return newKategori;
};


export const updateKategoriService = async (id, data) => {
    const kategori = await KategoriKesehatan.findByPk(id);
    if (!kategori) {
        throw new Error('Kategori tidak ditemukan');
    }

    // Jika nama_kategori diupdate, cek apakah sudah ada yang pakai
    if (data.nama_kategori && data.nama_kategori !== kategori.nama_kategori) {
        const existing = await KategoriKesehatan.findOne({ where: { nama_kategori: data.nama_kategori } });
        if (existing) {
        throw new Error('Nama kategori sudah digunakan');
        }
    }

    await KategoriKesehatan.update(data, { where: { id } });
    const updatedKategori = await KategoriKesehatan.findByPk(id);
    return updatedKategori;
};



export const deleteKategoriService = async (id) => {
    const kategori = await KategoriKesehatan.findByPk(id);
    if (!kategori) {
        throw new Error('Kategori tidak ditemukan');
    }

    await kategori.destroy();
    return { message: 'Kategori berhasil dihapus' };
};