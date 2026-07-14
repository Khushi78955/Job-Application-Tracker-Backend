import {registerUser, loginUser, refreshUserToken, logoutUser, sendVerificationEmail, verifyEmail} from "../services/auth.service.js";

export const register = async (req, res, next) => {
    try{
        const result = await registerUser(req.body);
         res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}


export const login = async (req, res, next) => {
    try{
        const result = await loginUser(req.body);
         res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}


export const refreshToken = async (req, res, next) => {
    try{
        const { refreshToken } = req.body;
        const result = await refreshUserToken(refreshToken);
        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}


export const logout = async (req, res, next) => {
    try{
        const { userId } = req.body;
        const result = await logoutUser(userId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (err) {
        next(err);
    }
}


export const sendVerification = async (req, res, next) => {
    try{
        const result = await sendVerificationEmail(req.user.userId);
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch(err){
        next(err)
    }

}

export const verify = async (req, res, next) => {
    try{
        const {token} = req.query;
        const result = await verifyEmail(token);
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch(err){
        next(err)
    }
}