import jwt from "jsonwebtoken";
import { addUserService, indexUsersSerice, updateUserService, deleteUserService, searchEmailService, getUserService } from "../services/User-service.js";
import Joi from "joi";

export const indexUser = async (request, h) => {
    const response = await indexUsersSerice();
    return h.response({
        status: 'success',
        data: response
    }).code(200);
};

export const addUser = async (request, h) => {
    try {
        const { name, email, password } = request.payload;
        const response = await addUserService(name, email, password);

        return h.response({
            status: "success",
            msg: "Berhasil Menambahkan User",
            data: response
        }).code(201);
    } catch (error) {
        console.error("Add error:", error.message);
        return h.response({
            status: "fail",
            msg: error.message
        }).code(400);
    }
}

export const updateUser = async (request, h) => {
    try {
        const { id } = request.params;
        const payload = request.payload;

        const schema = Joi.object({
            name: Joi.string().min(3).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional()
            });

            const { error } = schema.validate(payload);
            if (error) {
            return h.response({
                status: 'fail',
                msg: error.details[0].message
            }).code(400);
        }

        const updatedUser = await updateUserService(id, payload);

        return h.response({
            status: 'success',
            msg: 'Data pengguna berhasil diperbarui',
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                roleId: updatedUser.roleId
            }
            }).code(200);
    } catch (err) {
            console.error('Update error:', err.message);
            return h.response({
            status: 'fail',
            msg: err.message
            }).code(400);
    }
};


export const deleteUser = async (request, h) => {
    try {
        const { id } = request.params;

        const result = await deleteUserService(id);

        return h.response({
        status: 'success',
        msg: result.message
        }).code(200);
    } catch (error) {
        console.error('Delete error:', error.message);
        return h.response({
        status: 'fail',
        msg: error.message
        }).code(404);
    }
};

export const searchEmailHandler = async (request, h) => {
    const { email } = request.payload;

    try {
        const emailFromDatabase = await searchEmailService(email);

        if (!emailFromDatabase) {
        return h.response({
            message: "Email belum ada",
            email: false,
        }).code(200);
        }

        return h.response({
        message: "Email telah tersedia",
        email: true,
        }).code(200);

    } catch (err) {
        return h.response({
        message: "Terjadi kesalahan",
        error: err.message,
        }).code(500);
    }
};

export const getUserController = async (request, h) => {
    const auth = request.headers.authorization;

    if (!auth) {
        return h.response({
            status: "fail",
            message: "auth tidak tersedia"
        }).code(404);
    }

    try {
        const token = auth.split(" ")[1];
        const userVerify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return h.response({
            user: userVerify
        });
    } catch (err) {
        return h.response({
            status: "fail",
            error: err
        }).code(404);
    }
}

export const getUserFromId = async (request, h) => {
    const { id } = request.params;
    try {
        const user = await getUserService(id);
        return h.response({
            status: "success",
            data: user
        }).code(200);
    } catch (err) {
        return h.response({
            status: "fail",
            error: err
        }).code(404);
    }
}