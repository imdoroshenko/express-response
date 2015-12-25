'use strict';

class Response {

  constructor () {
    this._logMethod = this._defaultLogMethod;
    this._logLevel = 0;
    this._config = null;
    this._res = null;
    this._responseDriver = null;
  }

  setLogLevel (logLevel) {
    this._logLevel = logLevel;
    return this;
  }


  _defaultLogMethod (line) {
    console.log(line);
  }

  setLogMethod (logMethod) {
    if (typeof logMethod === 'function') {
      this._logMethod = logMethod;
    } else {
      throw new Error('Response.logMethod(), log method is not a function');
    }
    return this;
  }

  setConfig (config) {
    this._config = config;
    return this;
  }

  _log (level, value) {
    if (this._logLevel & level) {
      this._logMethod(value);
    }
    return this;
  }

  error (error) {
    this._log(Response.LOG_ERROR, error.stack || error);
    this._responseDriver(this._res, {
      status: error.statusCode || this._config.defaultExceptionStatus,
      headers: error.headers,
      response: error.message
    });
    return this;
  }

  success (data, options) {
    this._log(Response.LOG_SUCCESS, data);
    this._responseDriver(this._res, {
      status: 200,
      headers: options && options.headers,
      response: data
    });
    return this;
  }

  download (options) {
    this._log(Response.LOG_DOWNLOAD, options.filePath);
    this._downloadDriver(this._res, options);
  }

  setResponseDriver (driver) {
    this._responseDriver = driver;
    return this;
  }

  setDownloadDriver (driver) {
    this._downloadDriver = driver;
    return this;
  }

  use (res) {
    this._res = res;
    return this;
  }
}

Response.LOG_ERROR = 1;
Response.LOG_SUCCESS = 2;
Response.LOG_DOWNLOAD = 4;

module.exports = Response;
