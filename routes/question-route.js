import { createQuestionController, getQuestionsFromId } from "../controllers/question-controller.js";

const routeQuestion = [
    {
        method: "POST",
        path: "/api/question",
        handler: createQuestionController
    },
    {
        method: "GET",
        path: "/api/questions/{id}",
        handler: getQuestionsFromId
    }
];


export default routeQuestion;