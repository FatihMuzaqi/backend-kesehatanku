import { createArtikel, deleteArtikel, getArtikel, getArtikelById, updateArtikel } from "../controllers/artikel-controller.js";

const routeArtikel = [
    {
        method: 'GET',
        path: '/api/artikel',
        handler: getArtikel
    },

    {
        method: 'POST',
        path: '/api/artikel',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 10 * 1024 * 1024 + 1024, // Sedikit lebih besar dari 10MB
                multipart: true,
            }
        },
        handler: createArtikel
    },
    {
        method: 'GET',
        path: '/api/artikel/{id}',
        handler: getArtikelById
    },

    {
        method: 'PUT',
        path: '/api/artikel/{id}',
        handler: updateArtikel,
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                allow: 'multipart/form-data'
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/artikel/{id}',
        handler: deleteArtikel
    }
]

export default routeArtikel;
