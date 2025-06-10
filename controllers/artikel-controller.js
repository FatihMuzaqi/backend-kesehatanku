import { createArtikelService, deleteArtikelService, getArtikelByIdService, getArtikelService, updateArtikelService } from "../services/artikel-service.js";
import path from 'path';
import md5 from 'md5';
import Boom from '@hapi/boom';
import fs from 'fs';

export const getArtikel = async (request, h) => {
    const response = await getArtikelService();
    return h.response({
        status: 'success',
        data: response
    }).code(200);
}


export const createArtikel = async (request, h) => {
    try {
        const { payload } = request;

        const {
            kategori_id,
            judul,
            isi,
            author,
            status
        } = payload;

        const file = payload.images;

        // Validasi file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!file || !allowedTypes.includes(file.hapi.headers['content-type'])) {
            return Boom.badRequest('Format gambar tidak valid (harus jpg/jpeg/png)');
        }

        if (file._data.length > maxSize) {
            return Boom.badRequest('Ukuran gambar maksimal 10MB');
        }

        // Path folder tujuan
        const extension = path.extname(file.hapi.filename);
        const hashName = md5(file.hapi.filename + Date.now());
        const fileName = `${hashName}${extension}`;

        const fileDir = path.join('public', 'images', 'artikel');
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        const filePath = path.join(fileDir, fileName);
        fs.writeFileSync(filePath, file._data);

        // Buat URL gambar (ambil dari request info di Hapi)
        const protocol = request.server.info.protocol || 'http'; // default http
        const host = request.info.host; // biasanya sudah ada port
        const url = `${protocol}://${host}/images/artikel/${fileName}`;

        // Simpan ke DB
        const newArtikel = await createArtikelService({
            kategori_id,
            judul,
            isi,
            author,
            status,
            images: url,
        });

        return h.response({
            status: 'success',
            message: 'Artikel berhasil dibuat',
            data: newArtikel
        }).code(201);

    } catch (err) {
        console.error('Error createArtikel:', err);
        return Boom.internal('Terjadi kesalahan pada server');
    }
};


// READ (by ID)
export const getArtikelById = async (request, h) => {
    const { id } = request.params;
    const artikel = await getArtikelByIdService(id);

    if (!artikel) {
        return h.response({
            status: 'fail',
            message: 'Artikel tidak ditemukan'
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: artikel
    }).code(200);
};

// UPDATE
export const updateArtikel = async (request, h) => {
    try {
        console.log('params:', request.params);
        console.log('payload:', request.payload);

        const artikelId = request.params.id;
        const { payload } = request;

        const { kategori_id, judul, isi, author, status } = payload;
        const file = payload.images;

        const artikelLama = await getArtikelByIdService(artikelId);
        if (!artikelLama) {
            return Boom.notFound('Artikel tidak ditemukan');
        }

        let imageUrl = artikelLama.images;

        if (file && file.hapi) {
            console.log('File metadata:', file.hapi.headers);

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 10 * 1024 * 1024;

            if (!allowedTypes.includes(file.hapi.headers['content-type'])) {
                return Boom.badRequest('Format gambar tidak valid (harus jpg/jpeg/png)');
            }

            if (file._data.length > maxSize) {
                return Boom.badRequest('Ukuran gambar maksimal 10MB');
            }

            const extension = path.extname(file.hapi.filename);
            const hashName = md5(file.hapi.filename + Date.now());
            const fileName = `${hashName}${extension}`;

            const fileDir = path.join('public', 'images', 'artikel');
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }

            const filePath = path.join(fileDir, fileName);
            fs.writeFileSync(filePath, file._data);

            imageUrl = `${request.server.info.uri}/images/artikel/${fileName}`;

            const oldImagePath = artikelLama.images?.split('/images/artikel/')[1];
            if (oldImagePath) {
                const oldFile = path.join('public', 'images', 'artikel', oldImagePath);
                if (fs.existsSync(oldFile)) {
                    fs.unlinkSync(oldFile);
                }
            }
        }

        const updated = await updateArtikelService(artikelId, {
            kategori_id,
            judul,
            isi,
            author,
            status,
            images: imageUrl,
        });

        return h.response({
            status: 'success',
            message: 'Artikel berhasil diperbarui',
            data: updated
        }).code(200);

    } catch (err) {
        console.error('🔥 Error updateArtikel:', err);
        return Boom.internal('Terjadi kesalahan pada server');
    }
};


// DELETE
export const deleteArtikel = async (request, h) => {
    const { id } = request.params;
    const artikel = await deleteArtikelService(id);

    if (!artikel) {
        return h.response({
            status: 'fail',
            message: 'Artikel tidak ditemukan'
        }).code(404);
    }

    return h.response({
        status: 'success',
        message: 'Artikel berhasil dihapus'
    }).code(200);
};