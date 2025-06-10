import { getPenyakitService } from "../services/penyakit-service.js";

export const getPenyakit = async(request, h) => {
    const response = await getPenyakitService();
    return h.response({
        status:"success",
        data: response
    })
}