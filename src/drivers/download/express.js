module.exports = function JSONResponseDriver(res, params) {
  res.download(params.filePath);
};
