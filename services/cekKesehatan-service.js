import { Op } from 'sequelize';
import CekKesehatan from '../models/cekKesehatan-model.js';
import KategoriKesehatan from '../models/kategori-kesehatan.js';
import Kesehatan from '../models/kesehatan-model.js';
import HasilCekKesehatan from '../models/hasilCekKesehatan-model.js';
import HasilKonsultasiKesehatan from '../models/hasilKonsultasiKesehatan-model.js';


export const startSession = async (id) => {
    const cekKesehatan = await CekKesehatan.findByPk(id);
    if (!cekKesehatan) return null;

    const session = await SessionCekKesehatan.create({
        id_cek_kesehatan: id,
        current_block: 1,
        jawaban_user: {},
        total_score: 0
    });

    const firstQuestion = await PertanyaanKesehatan.findOne({
        where: { id_cek_kesehatan: id, block_number: 1 }
    });

    const totalQuestions = await PertanyaanKesehatan.count({ where: { id_cek_kesehatan: id } });

    return { session, firstQuestion, totalQuestions };
};


export const submitAnswer = async ({ session_id, block_number, jawaban, score }) => {
    const session = await SessionCekKesehatan.findByPk(session_id);
    if (!session) return null;

    const currentAnswers = session.jawaban_user || {};
    currentAnswers[`block_${block_number}`] = { jawaban, score: score || 0 };

    const newTotalScore = session.total_score + (score || 0);

    await session.update({
        jawaban_user: currentAnswers,
        total_score: newTotalScore,
        current_block: block_number + 1
    });

    const currentQuestion = await PertanyaanKesehatan.findOne({
        where: {
            id_cek_kesehatan: session.id_cek_kesehatan,
            block_number: block_number
        }
    });

    let nextBlockNumber = null;
    if (currentQuestion.kondisi_next && currentQuestion.kondisi_next[jawaban]) {
        nextBlockNumber = currentQuestion.kondisi_next[jawaban];
    } else if (!currentQuestion.is_final) {
        nextBlockNumber = block_number + 1;
    }

    if (nextBlockNumber) {
        const nextQuestion = await PertanyaanKesehatan.findOne({
            where: {
                id_cek_kesehatan: session.id_cek_kesehatan,
                block_number: nextBlockNumber
            }
        });

        if (nextQuestion) {
            const total = await PertanyaanKesehatan.count({ where: { id_cek_kesehatan: session.id_cek_kesehatan } });
            return { nextQuestion, progress: { current: nextBlockNumber, total } };
        }
    }

    await session.update({ status: 'completed' });

    const hasil = await HasilKesehatan.findOne({
        where: {
            id_cek_kesehatan: session.id_cek_kesehatan,
            min_score: { [Op.lte]: newTotalScore },
            max_score: { [Op.gte]: newTotalScore }
        }
    });

    return { completed: true, total_score: newTotalScore, result: hasil };
};


export const getAllCategories = async () => {
    return await CekKesehatan.findAll({
        include: [{ model: KategoriKesehatan, attributes: ['nama_kategori', 'images'] }]
    });
};


export const getCekKesehatanDetail = async (id) => {
    return await CekKesehatan.findByPk(id, {
        include: [
            { model: PertanyaanKesehatan, order: [['block_number', 'ASC']] },
            { model: HasilKesehatan }
        ]
    });
};


export const getAllKesehatanService = async () => {
    const kesehatan = HasilCekKesehatan.findAll();
    return kesehatan;
}

export const deleteKesehatanService = async (id) => {
    const kesehatan = HasilCekKesehatan.destroy({
        where: {
            id: id
        }
    });

    return kesehatan;
}

export const getAllKonsultasiService = async () => {
    const konsultasi = await HasilKonsultasiKesehatan.findAll();
    return konsultasi;
}

export const deleteKonsultasiService = async (id) => {
    const konsultasi = HasilKonsultasiKesehatan.destroy({
        where: {
            id: id
        }
    });

    return konsultasi;
}


