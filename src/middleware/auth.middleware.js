import AppError from "../errors/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";


const protect = async(req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new AppError("Unauthorized", 401);
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch {
            throw new AppError("Unauthorized", 401);
        }
        req.user = decoded;
        
        next();
    } catch(err){
        next(err)
    }
    
}

export default protect;