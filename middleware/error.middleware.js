import { ApiError } from "../utils/ApiError";

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
}

const errorHandler = (err,req,res,next) => {
    if ( err instanceof ApiError ){
        return res
                .status(err.statusCode)
                .json(
                    {
                        statusCode:err.statusCode,
                        message : err.message,
                        success : err.success,
                        errors: err.errors || [],
                        data: err.data || null,
                    }
                )
    }

    return res
            .status(500)
            .json(
                {
                    statusCode:500,
                    message : err.message || "Internal Server Error",
                    success : false,
                    errors: err.errors || [],
                    data: err.data || null,
                }
            )
}

export {notFound, errorHandler}