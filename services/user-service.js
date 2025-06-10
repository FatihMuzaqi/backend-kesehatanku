import { Users } from "../models/auth-model.js"
import bcrypt from 'bcrypt'

export const indexUsersSerice = () => {
    const data = Users.findAll();
    return data;
}


export const addUserService = async (name, email, password,) => {
    const user = await Users.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            throw new Error("User sudah ada");
        }
        const salt = await bcrypt.genSalt();
        const hashpassword = await bcrypt.hash(password, salt);
        const newUser = await Users.create({
            name: name,
            email: email,
            roleId: 2,
            password: hashpassword
        });
    
        return newUser; 
}


export const updateUserService = async (id, { name, email, password }) => {
    const user = await Users.findByPk(id);
    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    if (email && email !== user.email) {
        const existing = await Users.findOne({ where: { email } });
        if (existing) {
        throw new Error('Email sudah digunakan oleh pengguna lain');
        }
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedFields.password = await bcrypt.hash(password, salt);
    }

    await user.update(updatedFields);

    return user;
};


export const deleteUserService = async (id) => {
    const user = await Users.findByPk(id);
    if (!user) {
        throw new Error('Pengguna tidak ditemukan');
    }

    await user.destroy();
    return { message: 'Pengguna berhasil dihapus' };
};

export const searchEmailService = async (email) => {
    return await Users.findOne({ where: { email } });
}

export const getUserService = async (id) => {
    const user = await Users.findOne({
        where: {
            id: id
        }
    });
    return user;
}