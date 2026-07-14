import { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication } from "../services/application.service.js";

export const create = async (req, res, next) => {
    try{
        const result = await createApplication(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            message: "Application created successfully",
            data: result,
        });
    } catch(err){
        next(err)
    }
}

export const getAll = async (req, res, next) => {
    try{
        const result = await getApplications(req.user.userId, req.validated);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err){
        next(err)
    }
}


export const getById = async (req, res, next) => {
    try{
        const result = await getApplicationById(req.user.userId, req.params.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err){
        next(err)
    }
}


export const update = async (req, res, next) => {
    try{
        const result = await updateApplication(req.user.userId, req.params.id, req.validated);
        res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: result,
        });
    } catch(err){
        next(err)
    }
}



export const remove = async (req, res, next) => {
    try{
        const result = await deleteApplication(req.user.userId, req.params.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch(err){
        next(err)
    }
}