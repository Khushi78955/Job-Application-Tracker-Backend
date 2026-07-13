import dotenv from "dotenv"
import app from "./app.js"
import pool from "./config/db.js"

dotenv.config();

const PORT = process.env.PORT || 2000;

const startServer = async () => {
    try{
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch(err){
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

startServer();