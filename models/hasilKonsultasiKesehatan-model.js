import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import {Users} from './auth-model.js'

const HasilKonsultasiKesehatan = db.define('HasilKonsultasiKesehatan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  hasil_prediksi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  saran: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  currentTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: false,
  tableName: 'hasil_konsultasi_kesehatan',
  timestamps: false
});

export default HasilKonsultasiKesehatan;


Users.hasMany(HasilKonsultasiKesehatan, { foreignKey: 'user_id' });
HasilKonsultasiKesehatan.belongsTo(Users, { foreignKey: 'user_id' });