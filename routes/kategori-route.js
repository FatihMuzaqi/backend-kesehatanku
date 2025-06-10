import { addKategoriController, deleteKategoriController, getKategoriController, updateKategoriController } from "../controllers/kategori-controller.js";

const routeKategori = [
    {
        method: 'GET',
        path: '/api/kategori',
        handler: getKategoriController
    },

    {
        method: 'POST',
        path: '/api/kategori',
        handler: addKategoriController,
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
        method: 'PUT',
        path: '/api/kategori/{id}',
        handler: updateKategoriController,
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
        path: '/api/kategori/{id}',
        handler: deleteKategoriController,
    },
];

export default routeKategori;
