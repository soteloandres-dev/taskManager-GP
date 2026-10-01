// aqui creamos y exportamos la configuracion de la conexion
import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 54321)/* convertir DB_PORT a number */,
    user: process.env.DB_USER,
    //password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

export default pool
