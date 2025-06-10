import { getPenyakit } from "../controllers/penyakit-controller.js";

const authPenyakit = [
    {
        method:'GET',
        path:'/penyakit',
        handler: getPenyakit
    }
]

export default authPenyakit