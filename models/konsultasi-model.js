import { Sequelize, DataTypes } from "sequelize";
import db from '../config/db.js';

const Konsultasi = db.define('konsultasi_penyakit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    penyakit: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
    },
    saran: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    }, {
        tableName: 'konsultasi_penyakit',
        timestamps: true,
    });

Konsultasi.beforeCreate((instance) => {
    if (!instance.deskripsi) {
        instance.deskripsi = `Anda terdeteksi mengalami gejala dan resiko yang mengarah pada penyakit ${instance.penyakit}.`;
    }

    if (!instance.saran) {
        instance.saran = `Diperlukan pemeriksaan lebih lanjut untuk memastikan diagnosis penyakit ${instance.penyakit}, Pergi ke rumah sakit atau puskesmas terdekat untuk di tindak lanjuti.`;
    }
    });

export default Konsultasi;