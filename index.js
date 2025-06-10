'use strict';
import Hapi, { server } from '@hapi/hapi'
import routeAuth from './routes/auth-route.js';
import db from './config/db.js';
import Inert from '@hapi/inert';
import routePenyakit from './routes/penyakit-route.js';
import Penyakit from './models/penyakit-model.js';
import KategoriKesehatan from './models/kategori-kesehatan.js';
import CekKesehatan from './models/cekKesehatan-model.js';
import Kulit from './models/kulit-model.js';
import Kehamilan from './models/kehamilan-model.js';
import KonsultasiPenyakit from './models/konsultasi-penyakit.js';
import routeUser from './routes/user-route.js';
import routeKategori from './routes/kategori-route.js';
import Artikel from './models/artikel-model.js';
import routeArtikel from './routes/artikel-route.js';
import routesCekKesehatan from './routes/cekKesehatan-route.js';
import Kesehatan from './models/kesehatan-model.js';
import likesRoute from './routes/likes-route.js';
import { reactions } from './models/reactions-artikel.js';
import Konsultasi from './models/konsultasi-model.js';
import routeQuestion from './routes/question-route.js';
import HasilCekKesehatan from './models/hasilCekKesehatan-model.js';

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'],
                credentials: true,
                headers: ['Authorization', 'Content-Type']
            },
        }
    });

    await server.register(Inert);

    server.route({
    method: 'GET',
    path: '/images/{param*}',
    handler: {
        directory: {
            path: 'public/images',
            listing: false,
            index: false,
        },
    },
  });

    server.state('refreshToken', {
        ttl: null,
        isSecure: false, // ubah ke true kalau sudah pakai https
        isHttpOnly: true,
        path: '/',
        encoding: 'none', // biar bisa baca token string biasa
    });

    try {
        await db.authenticate();
        console.log('Database Connected...');
        await db.sync();
    } catch (error) {
        
    }
    
    server.route(likesRoute);
    server.route(routesCekKesehatan);
    server.route(routeArtikel);
    server.route(routeKategori);
    server.route(routeUser)
    server.route(routePenyakit);
    server.route(routeAuth);
    server.route(routeQuestion);


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


init();