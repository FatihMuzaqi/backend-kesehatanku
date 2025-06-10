import { reactions } from "../models/reactions-artikel.js"

export const insertLike = async (user_id, artikel_id, status) => {
    const res = await reactions.create({
        user_id: user_id,
        artikel_id: artikel_id,
        status: status
    });
    return res;
}

export const getLikesService = async (id) => {
    const res = await reactions.findAll({
        where: {
            artikel_id: id
        }
    });
    return res;
}

export const editLikesService = async (data) => {
    const res = await reactions.update(data, {
        where: {
            artikel_id: data.artikel_id,
            user_id: data.user_id
        }
    });

    return res;
}

export const findLikeService = async (artikel_id, user_id) => {
    const res = await reactions.findOne({
        where: {
            artikel_id: artikel_id,
            user_id: user_id
        }
    });
    return res;
}