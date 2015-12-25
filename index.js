module.exports = {
  Response: require('./src/response.js'),
  driver: {
    response: {
      json: require('./src/drivers/response/json.js')
    },
    download: {
      nginx: require('./src/drivers/download/nginx.js'),
      express: require('./src/drivers/download/express.js')
    }
  }
};
