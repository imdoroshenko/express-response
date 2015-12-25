module.exports = function JSONResponseDriver(res, params) {
    res.type('application/json');
    if (params.headers) {
        res.set(params.headers);
    }
    res.status(params.status).json(params.response);
};
