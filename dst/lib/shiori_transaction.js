if(typeof exports === 'undefined' && typeof window !== 'undefined') var exports = window;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof require !== 'undefined') {
  var ShioriConverter = require('shiori_converter').ShioriConverter;
}

/**
 * SHIORI/2.x/3.x transaction class with protocol version converter
 */

var ShioriTransaction = function () {
  /**
   * constructor
   * @return {ShioriTransaction} this
   */

  function ShioriTransaction() {
    _classCallCheck(this, ShioriTransaction);
  }

  /**
   * request
   * @return {ShioriJK.Message.Request} request
   */

  _createClass(ShioriTransaction, [{
    key: 'request_to',

    /**
     * convert request to specified protocol version
     * (this method needs ShioriConverter)
     * @param {string} version - target protocol version
     * @return {ShioriJK.Message.Request} specified version request
     */
    value: function request_to(version) {
      return ShioriConverter.request_to(this.request, version);
    }

    /**
     * convert response to specified protocol version
     * (this method needs ShioriConverter)
     * @param {string} version - target protocol version
     * @return {ShioriJK.Message.Response} specified version response
     */

  }, {
    key: 'response_to',
    value: function response_to(version) {
      return ShioriConverter.response_to(this.request, this.response, version);
    }
  }, {
    key: 'request',
    get: function get() {
      return this._request;
    }

    /**
     * request
     * @param {ShioriJK.Message.Request} request - request
     * @return {ShioriJK.Message.Request} request
     */
    ,
    set: function set(request) {
      this._request = request;
      this._request.to = this.request_to.bind(this);
      return this._request;
    }

    /**
     * response
     * @return {ShioriJK.Message.Response} response
     */

  }, {
    key: 'response',
    get: function get() {
      return this._response;
    }

    /**
     * response
     * @param {ShioriJK.Message.Response} response - response
     * @return {ShioriJK.Message.Response} response
     */
    ,
    set: function set(response) {
      this._response = response;
      this._response.to = this.response_to.bind(this);
      return this._response;
    }
  }]);

  return ShioriTransaction;
}();

exports.ShioriTransaction = ShioriTransaction;