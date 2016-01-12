'use strict';

if (typeof require !== 'undefined') {
  var ShioriConverter = require('shiori_converter').ShioriConverter;
}

/**
 * SHIORI/2.x/3.x transaction class with protocol version converter
 */
class ShioriTransaction {
  /**
   * constructor
   * @return {ShioriTransaction} this
   */
  constructor() {
  }

  /**
   * request
   * @return {ShioriJK.Message.Request} request
   */
  get request() {
    return this._request;
  }

  /**
   * request
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} request
   */
  set request(request) {
    this._request = request;
    this._request.to = this.request_to.bind(this);
    return this._request;
  }

  /**
   * response
   * @return {ShioriJK.Message.Response} response
   */
  get response() {
    return this._response;
  }

  /**
   * response
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} response
   */
  set response(response) {
    this._response = response;
    this._response.to = this.response_to.bind(this);
    return this._response;
  }

  /**
   * convert request to specified protocol version
   * (this method needs ShioriConverter)
   * @param {string} version - target protocol version
   * @return {ShioriJK.Message.Request} specified version request
   */
  request_to(version) {
    return ShioriConverter.request_to(this.request, version);
  }

  /**
   * convert response to specified protocol version
   * (this method needs ShioriConverter)
   * @param {string} version - target protocol version
   * @return {ShioriJK.Message.Response} specified version response
   */
  response_to(version) {
    return ShioriConverter.response_to(this.request, this.response, version);
  }

}

export {ShioriTransaction};
