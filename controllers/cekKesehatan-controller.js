import { startSession, submitAnswer, getAllCategories, getCekKesehatanDetail, getAllKesehatanService, deleteKesehatanService, getAllKonsultasiService, deleteKonsultasiService } from "../services/cekKesehatan-service.js";
import Kesehatan from "../models/kesehatan-model.js";
import axios from 'axios';
import FormData from 'form-data';
import HasilKonsultasiKesehatan from "../models/hasilKonsultasiKesehatan-model.js";
import HasilCekKesehatan from "../models/hasilCekKesehatan-model.js";

export const handleStartSession = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await startSession(id);

        if (!result) return h.response({ error: 'Cek kesehatan tidak ditemukan' }).code(404);

        const { session, firstQuestion, totalQuestions } = result;

        return h.response({
            session_id: session.id,
            question: firstQuestion,
            progress: {
                current: 1,
                total: totalQuestions
            }
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};

export const handleSubmitAnswer = async (request, h) => {
    try {
        const result = await submitAnswer(request.payload);
        if (!result) return h.response({ error: 'Session tidak ditemukan' }).code(404);

        return h.response(result).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};

export const handleGetCategories = async (request, h) => {
    try {
        const categories = await getAllCategories();
        return h.response(categories).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};

export const handleGetDetail = async (request, h) => {
    try {
        const { id } = request.params;
        const data = await getCekKesehatanDetail(id);

        if (!data) return h.response({ error: 'Cek kesehatan tidak ditemukan' }).code(404);
        return h.response(data).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};



export const createKesehatan = async (request, h) => {
  try {
    const { id_kategori, title, deskripsi, saran } = request.payload;

    if (!id_kategori || !title || !saran) {
      return h.response({ message: 'id_kategori, title, dan saran wajib diisi' }).code(400);
    }

    const newKesehatan = await Kesehatan.create({
      id_kategori,
      title,
      deskripsi,
      saran,
    });

    return h.response({
      message: 'Data kesehatan berhasil dibuat',
      data: newKesehatan,
    }).code(201);

  } catch (error) {
    console.error(error);
    return h.response({
      message: 'Terjadi kesalahan saat menyimpan data kesehatan',
      error: error.message,
    }).code(500);
  }
};

export const getAllkesehatan = async (request, h) => {
  try {
    const kesehatan = await getAllKesehatanService();
    return h.response({
      status: "success",
      data: kesehatan
    }).code(200);
  } catch (err) {
    return h.response({
      status: "fail",
      error: err
    }).code(500);
  }
}

export const deleteKesehatanById = async (request, h) => {
  const { id } = request.params;
  try {
    const kesehatan = await deleteKesehatanService(id);
    return h.response({
      status: "success",
      message: "Berhasil menghapus kesehatan"
    }).code(200);
  } catch (err) {
    return h.response({
      status: "fail",
      error: err
    }).code(500);
  }
}

export const getAllKonsultasi = async (request, h) => {
  try {
    const konsultasi = await getAllKonsultasiService();
    return h.response({
      status: "success",
      data: konsultasi
    }).code(200);
  } catch (err) {
    return h.response({
      status: "fail",
      error: err
    }).code(500);
  }
}

export const deleteKonsultasiById = async (request, h) => {
  const { id } = request.params;
  try {
    const kesehatan = await deleteKonsultasiService(id);
    return h.response({
      status: "success",
      message: "Berhasil menghapus kesehatan"
    }).code(200);
  } catch (err) {
    return h.response({
      status: "fail",
      error: err
    }).code(500);
  }
}


// export const handleHealthCheck = async (request, h) => {
//   const { symptoms } = request.payload;

//   try {
//     const response = await axios.post(' http://127.0.0.1:3000/predict', {
//       symptoms
//     });

//     return h.response(response.data).code(200);
//   } catch (error) {
//     console.error('Error forwarding to ML model:', error.message);
//     return h.response({
//       error: 'Gagal menghubungi server machine learning',
//       detail: error.message
//     }).code(500);
//   }
// };

/////////////////////////////////////// CONTROLLER MACHINE LERNING ///////////////////////////////////////////



export const predictKulit = async (request, h) => {
  const { file, userId } = request.payload;

  if (!file || !file.hapi || !file._data) {
    return h.response({ error: 'No file uploaded' }).code(400);
  }

  try {
    const formData = new FormData();
    formData.append('file', file._data, {
      filename: file.hapi.filename,
      contentType: file.hapi.headers['content-type'],
    });

    const response = await axios.post('https://machinelearningapi-production.up.railway.app/predict-kulit', formData, {
      headers: formData.getHeaders(),
    });

    const kelas = response.data.class;
    const akurasi = response.data.confidence;

    const deskripsi =` Ciri-ciri yang ditemukan mengarah pada kemungkinan Anda mengidap penyakit ${kelas}`;
    const saran = `Diperlukan pemeriksaan lebih lanjut untuk memastikan diagnosis penyakit ${kelas}, Pergi ke rumah sakit atau puskesmas terdekat untuk di tindak lanjuti`;

    // Simpan ke database
    await HasilKonsultasiKesehatan.create({
      user_id: userId,
      hasil_prediksi: kelas,
      saran: saran,
      currentTime: new Date()
    });

    return h.response({

    }).code(200);

  } catch (error) {
    console.error('Error forwarding to ML model:', error.message);
    return h.response({
      error: 'Gagal menghubungi server machine learning',
      detail: error.message,
    }).code(500);
  }
};

export const predictKesehatan = async (request, h) => {
  const { symptoms, user } = request.payload;
  // Ambil user_id dari auth credentials


  if (!symptoms) {
    return h.response({ error: 'Symptoms data required' }).code(400);
  }

  try {
    const response = await axios.post('http://127.0.0.1:3000/predict-kesehatan', { symptoms });
    const prediksi = response.data.predicted;

    const deskripsi = `Anda terdeteksi mengalami gejala dan resiko yang mengarah pada penyakit ${prediksi}.`;
    const saran = `Sebaiknya segera lakukan pemeriksaan medis di fasilitas kesehatan terdekat untuk mendapatkan diagnosis yang tepat mengenai penyakit ${prediksi}.`;

    // Simpan ke database
    await HasilCekKesehatan.create({
      user_id: user.userID,
      hasil_prediksi: deskripsi,
      saran: saran
    });

    return h.response({
      deskripsi,
      saran
    }).code(200);
  } catch (error) {
    console.error('Error forwarding to ML model:', error.message);
    return h.response({
      error: 'Gagal menghubungi server machine learning',
      detail: error.message,
    }).code(500);
  }
};