import { editLikesService, findLikeService, getLikesService, insertLike } from "../services/likes-service.js";


export const createLikes = async (request, h) => {
    const { user_id, artikel_id, status } = request.payload;

    if (!user_id) {
        return h.response({
            status: "fail",
            message: "anda belum melakukan login"
        }).code(404);
    }

    try {
        const findLike = await findLikeService(artikel_id, user_id);

        if (!findLike) {
            await insertLike(user_id, artikel_id, status);
            return h.response({
                status: "success",
                message: "berhasil like"
            }).code(200);
        }

        await editLikesService({ artikel_id: artikel_id, user_id: user_id, status: status });
        return h.response({
            status: "success",
            message: "berhasil update"
        }).code(200);

    } catch (err) {
        return h.response({
            status: "fail",
            error: err
        }).code(404);
    }
}

export const getlikeById = async (request, h) => {
    const { user_id, artikel_id } = request.payload;

    if (!user_id) {
        return h.response({
            status: "fail",
            message: "bad request"
        }).code(404);
    }
    try {
        const like = await findLikeService(artikel_id, user_id);
        if (!like) {
            return h.response({
                status: "fail",
                message: "anda belum like"
            });
        }
        return h.response({
            status: "success",
            data: like
        }).code(200);

    } catch (err) {
        return h.response({
            status: "fail",
            error: err
        })
    }
}

export const getLikes = async (request, h) => {
    const { id } = request.params;

    try {
        const likes = await getLikesService(id);
        return h.response({
            status: "success",
            data: likes
        }).code(200);
    } catch (err) {
        return h.response({
            status: "fail",
            message: "gagal mengambil reactions",
            error: err
        }).code(404);
    }
}