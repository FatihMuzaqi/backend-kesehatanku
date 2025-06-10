import { addUser, deleteUser, getUserController, getUserFromId, indexUser, searchEmailHandler, updateUser } from "../controllers/user-controller.js"


const routeUser = [
    {
        method: 'GET',
        path: '/api/users',
        handler: indexUser
    },

    {
        method: 'POST',
        path: '/api/users',
        handler: addUser
    },

    {
        method: 'PUT',
        path: '/api/users/{id}',
        handler: updateUser,
    },

    {
        method: 'DELETE',
        path: '/api/users/{id}',
        handler: deleteUser
    },

    {
        method: 'POST',
        path: '/api/search-email',
        handler: searchEmailHandler
    },
    {
        method: "GET",
        path: "/api/user",
        handler: getUserController
    },
    {
        method: "GET",
        path: "/api/user/{id}",
        handler: getUserFromId
    }
]

export default routeUser;