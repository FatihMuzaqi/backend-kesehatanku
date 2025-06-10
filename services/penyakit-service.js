import Penyakit from "../models/penyakit-model.js";

export const getPenyakitService = async () => {
    const penyakit = await Penyakit.findAll();
    return penyakit
}