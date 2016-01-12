# [shiori_transaction.js](https://github.com/Narazaka/shiori_transaction.js)

[![npm](https://img.shields.io/npm/v/shiori_transaction.svg)](https://www.npmjs.com/package/shiori_transaction)
[![npm license](https://img.shields.io/npm/l/shiori_transaction.svg)](https://www.npmjs.com/package/shiori_transaction)
[![npm download total](https://img.shields.io/npm/dt/shiori_transaction.svg)](https://www.npmjs.com/package/shiori_transaction)
[![npm download by month](https://img.shields.io/npm/dm/shiori_transaction.svg)](https://www.npmjs.com/package/shiori_transaction)
[![Bower](https://img.shields.io/bower/v/shiori_transaction.svg)](https://github.com/Narazaka/shiori_transaction.js)
[![Bower](https://img.shields.io/bower/l/shiori_transaction.svg)](https://github.com/Narazaka/shiori_transaction.js)

[![Dependency Status](https://david-dm.org/Narazaka/shiori_transaction.js.svg)](https://david-dm.org/Narazaka/shiori_transaction.js)
[![devDependency Status](https://david-dm.org/Narazaka/shiori_transaction.js/dev-status.svg)](https://david-dm.org/Narazaka/shiori_transaction.js#info=devDependencies)
[![Build Status](https://travis-ci.org/Narazaka/shiori_transaction.js.svg)](https://travis-ci.org/Narazaka/shiori_transaction.js)
[![codecov.io](https://codecov.io/github/Narazaka/shiori_transaction.js/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiori_transaction.js?branch=master)
[![Code Climate](https://codeclimate.com/github/Narazaka/shiori_transaction.js/badges/gpa.svg)](https://codeclimate.com/github/Narazaka/shiori_transaction.js)

SHIORI Protocol transaction

## Install

npm:
```
npm install shiori_transaction
```

bower:
```
bower install shiori_transaction
```

This module depends on [ShioriJK](https://github.com/Narazaka/shiorijk) and [shiori_converter.js](https://github.com/Narazaka/shiori_converter.js).

## Usage

node.js:
```javascript
var shiori_transaction = require('shiori_transaction');
var ShioriTransaction = shiori_transaction.ShioriTransaction;
```

browser:
```html
<script src="shiorijk.js"></script>
<script src="shiori_converter.js"></script>
<script src="shiori_transaction.js"></script>
```

```javascript
var request3 = new ShioriJK.Message.Request({
  request_line: {
    method: 'GET',
    version: '3.0',
  },
  headers: {
    ID: 'OnBoot',
    Charset: 'UTF-8',
    Sender: 'Ikagaka',
  },
});

var response2 = new ShioriJK.Message.Response({
  status_line: {
    code: 200,
    version: '2.6',
  },
  headers: {
    Sentence: '\\h\\s[0]\\e',
    Charset: 'UTF-8',
    Sender: 'ikaga',
  },
});

var transaction = new ShioriTransaction();
transaction.request = request3;
console.log(request3.to('2.6').toString());

transaction.response = response2;
console.log(response2.to('3.0').toString());
```

## API

[API Document](https://narazaka.github.io/shiori_transaction.js/index.html)

## License

This is released under [MIT License](http://narazaka.net/license/MIT?2015).
