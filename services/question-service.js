import questions from "../models/question-model.js";


export const createQuestionService = async ({ kategori_id, name_symptom, question }) => {
    const create = await questions.create({
        kategori_id,
        name_symptom,
        question
    });
    return create;
}

export const getQuestionsFromIdService = async (id) => {
    const question = await questions.findAll({
        where: {
            kategori_id: id
        }
    });

    return question;
}