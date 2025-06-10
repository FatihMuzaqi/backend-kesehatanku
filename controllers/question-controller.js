import { createQuestionService, getQuestionsFromIdService } from "../services/question-service.js";

export const createQuestionController = async (request, h) => {
    const { kategori_id, name_symptom, question } = request.payload;

    if (!kategori_id) {
        return h.response({
            status: "fail",
            message: "bad request"
        }).code(403);
    }

    try {
        const create = await createQuestionService({ kategori_id, name_symptom, question });
        return h.response({
            status: "success",
            message: "berhasil membuat question"
        }).code(201);
    } catch (err) {
        return h.response({
            status: "fail",
            message: err.message
        }).code(403);
    }
}

export const getQuestionsFromId = async (request, h) => {
    const { id } = request.params;

    try {
        const questions = await getQuestionsFromIdService(id);
        return h.response({
            status: "success",
            data: questions
        }).code(200);
    } catch (err) {
        return h.response({
            status: "fail",
            message: err.message
        })
    }
}