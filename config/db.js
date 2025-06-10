import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const db = new Sequelize(
    process.env.DATABASE_URL,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

export default db