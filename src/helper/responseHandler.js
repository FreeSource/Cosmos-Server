const httpStatus = require("http-status");

const logError = (err) => {
    console.error(err);
};

const logErrorMiddleware = (err, req, res, next) => {
    logError(err);
    next(err);
};

const returnError = (statusCode, message) => {
    return {
        code: statusCode,
        status: false,
        message,
    };
};

const returnSuccess = (statusCode, message, data = {}) => {
    return {
        code: statusCode,
        status: true,
        message,
        data,
    };
};

const returnUnrecoverableError = (req, res) => {
    let { code, status, message } = returnError(httpStatus.BAD_GATEWAY, 'An error occured while preforming this action.');
    return res.status(code).json({ code, status, message });
}

const getPaginationData = (rows, page, limit) => {
    const { count: totalItems, rows: data } = rows;
    const currentPage = page ? Number(page) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        data,
        totalPages,
        currentPage,
    };
};

module.exports = {
    logError,
    logErrorMiddleware,
    returnError,
    returnSuccess,
    getPaginationData,
    returnUnrecoverableError,
};
