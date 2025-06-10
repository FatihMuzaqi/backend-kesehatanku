import { createLikes, getlikeById, getLikes } from "../controllers/likes-controller.js";

const likesRoute = [
    {
        method: "POST",
        path: "/api/likes",
        handler: createLikes
    },
    {
        method: "GET",
        path: "/api/likes/{id}",
        handler: getLikes
    },
    {
        method: "POST",
        path: "/api/like",
        handler: getlikeById
    }
];

export default likesRoute;