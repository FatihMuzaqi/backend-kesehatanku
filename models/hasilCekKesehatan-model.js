import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import {Users} from './auth-model.js'

const HasilCekKesehatan = db.define('HasilCekKesehatan', {
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
  tableName: 'hasil_cek_kesehatan',
  timestamps: false
});

export default HasilCekKesehatan;


Users.hasMany(HasilCekKesehatan, { foreignKey: 'user_id' });
HasilCekKesehatan.belongsTo(Users, { foreignKey: 'user_id' });