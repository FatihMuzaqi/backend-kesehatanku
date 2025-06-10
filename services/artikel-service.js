import Artikel from "../models/artikel-model.js";

export const getArtikelService = async () => {
    const response = await Artikel.findAll();
    return response;
}

export const createArtikelService = async (payload) => {
    const artikel = await Artikel.create(payload);
    return artikel;
};


export const getArtikelByIdService = async (id) => {
    return await Artikel.findByPk(id);
};

export const updateArtikelService = async (id, payload) => {
    const artikel = await Artikel.findByPk(id);
    if (!artikel) return null;

    await artikel.update(payload);
    return artikel;
};

export const deleteArtikelService = async (id) => {
    const artikel = await Artikel.findByPk(id);
    if (!artikel) return null;

    await artikel.destroy();
    return artikel;
};