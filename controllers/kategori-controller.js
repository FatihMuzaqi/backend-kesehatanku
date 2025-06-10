import { getKategori, addKategoriService, updateKategoriService, deleteKategoriService } from "../services/kategori-service.js";
import Joi from "joi";
import Boom from '@hapi/boom';

export const getKategoriController = async (request, h) => {
    try {
        const response = await getKategori();
        return h.response({
            status: 'success',
            data: response
        }).code(200);
    } catch (err) {
        return h.response({
            status: "fail",
            error: err
        })
    }
}

export const addKategoriController = async (request, h) => {
    try {
        // Validasi payload nama_kategori & deskripsi
        const schema = Joi.object({
            nama_kategori: Joi.string().min(3).required(),
            deskripsi: Joi.string().allow('').optional(),
        });

        const { nama_kategori, deskripsi, images } = request.payload;
        const { error } = schema.validate({ nama_kategori, deskripsi });
        if (error) {
            return h.response({
                status: 'fail',
                msg: error.details[0].message,
            }).code(400);
        }

        // Panggil service dengan file images jika ada
        const newKategori = await addKategoriService(
            { nama_kategori, deskripsi, file: images || null },
            request.server.info.uri
        );

        return h.response({
            status: 'success',
            msg: 'Kategori berhasil ditambahkan',
            data: newKategori,
        }).code(201);
    } catch (err) {
        if (err.message.includes('Nama kategori sudah digunakan')) {
            return h.response({
                status: 'fail',
                msg: err.message,
            }).code(400);
        }
        if (
            err.message.includes('Format gambar tidak valid') ||
            err.message.includes('Ukuran gambar maksimal')
        ) {
            return Boom.badRequest(err.message);
        }
        console.error('addKategoriController Error:', err);
        return Boom.internal('Terjadi kesalahan pada server');
    }
};

export const updateKategoriController = async (request, h) => {
    try {
        const { id } = request.params;
        const { nama_kategori, deskripsi, images } = request.payload;

        // Validasi payload
        const schema = Joi.object({
            nama_kategori: Joi.string().min(3).optional(),
            deskripsi: Joi.string().allow('').optional(),
        });

        const { error } = schema.validate({ nama_kategori, deskripsi });
        if (error) {
            return h.response({
                status: 'fail',
                msg: error.details[0].message,
            }).code(400);
        }

        const updatedKategori = await updateKategoriService(
            id,
            { nama_kategori, deskripsi, file: images || null },
            request.server.info.uri
        );

        return h.response({
            status: 'success',
            msg: 'Kategori berhasil diperbarui',
            data: updatedKategori,
        }).code(200);
    } catch (err) {
        if (
            err.message.includes('Kategori tidak ditemukan') ||
            err.message.includes('Nama kategori sudah digunakan')
        ) {
            return h.response({
                status: 'fail',
                msg: err.message,
            }).code(400);
        }

        if (
            err.message.includes('Format gambar tidak valid') ||
            err.message.includes('Ukuran gambar maksimal')
        ) {
            return Boom.badRequest(err.message);
        }

        console.error('updateKategoriController Error:', err);
        return Boom.internal('Terjadi kesalahan pada server');
    }
};

export const deleteKategoriController = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await deleteKategoriService(id);

        return h.response({
            status: 'success',
            msg: result.message,
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            msg: err.message,
        }).code(400);
    }
};