import { Users, Roles } from "../models/auth-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import { Op } from 'sequelize';
import crypto from 'crypto';

export const serviceGetUser = async () => {
    const dataUser = await Users.findAll();
    return dataUser;
};

export const RegisterServices = async (name, email, password, confPassword) => {
    const user = await Users.findOne({
        where: {
        email: email,
        },
    });
    if (user) {
        throw new Error("User sudah ada");
    }
    if (password !== confPassword) {
        throw new Error("Password dan konfirmasi password tidak sama");
    }
    const salt = await bcrypt.genSalt();
    const hashpassword = await bcrypt.hash(password, salt);
    const newUser = await Users.create({
        name: name,
        email: email,
        roleId: 2,
        password: hashpassword,
    });

    return newUser;
};

export const LoginService = async (email, password) => {
    const user = await Users.findOne({
        where: { email },
        include: {
        model: Roles,
        as: "role",
        attributes: ["name"],
        },
    });

    if (!user) {
        throw new Error("Email tidak ditemukan");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Password salah");
    }
    const roles = user.role.name;

    const userID = user.id;
    const name = user.name;

    const accessToken = jwt.sign(
        { userID, name, email, roles },
        process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: "20h",
        }
    );

    const refreshToken = jwt.sign(
        { userID, name, email, roles },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn: "1d",
        }
    );

    await Users.update(
        { refresh_token: refreshToken },
        { where: { id: userID } }
    );

    return { accessToken, refreshToken, roles };
};

export const refreshTokenServise = async (refreshToken) => {
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) {
    throw new Error("Forbidden");
  }

  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        throw new Error("Forbidden");
      }

      const userID = user[0].id;
      const name = user[0].name;
      const email = user[0].email;

      const accessToken = jwt.sign(
        { userID, name, email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );

      return accessToken;
    }
  );
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fatih.muzaqi123@gmail.com', 
        pass: 'lqob yudp tkjn hxgf', 
    }
});

export const sendResetEmail = async (email) => {
  // Cari user berdasarkan email
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new Error('Email tidak ditemukan');

  // Generate token acak
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Token expire dalam 1 jam
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

  // Simpan token & expired di DB user
  await Users.update(
    { reset_token: resetToken, reset_token_expires: resetTokenExpires },
    { where: { id: user.id } }
  );

  // Buat link reset password
  const resetURL = `http://localhost:5000/reset-password/${resetToken}`;

  // Kirim email ke user
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password Link',
    text: `Klik link berikut untuk mereset password Anda:\n\n${resetURL}\n\nLink ini berlaku 1 jam.`,
  };

  await transporter.sendMail(mailOptions);
};

export const resetPasswordService = async (token, newPassword) => {
  // Cari user berdasarkan reset token dan cek expired
  const user = await Users.findOne({
    where: {
      reset_token: token,
      reset_token_expires: {
        [Op.gt]: new Date()  // token belum expired
      }
    }
  });

  if (!user) throw new Error('Token tidak valid atau sudah kedaluwarsa');

  // Hash password baru
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password dan hapus token
  await Users.update(
    {
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    },
    {
      where: { id: user.id }
    }
  );

  return { message: 'Password berhasil diubah' };
};