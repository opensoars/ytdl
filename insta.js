"use strict";

const prodl = require('./dist/index.js');

let dl1 = new prodl.Download({
  v: '7ruDVn70dPw'
});

dl1.on('error', (err) => {
  console.log('error', err);
});

dl1.on('succes', (result) => {
  console.log('succes', result);
});

dl1.start();