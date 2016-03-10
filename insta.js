"use strict";

const fs = require('fs');

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  //'NnTg4vzli5s',
  //'sQVeK7Dt18U',
  'ynMPpTU_VuI'
];



vs.forEach(v => {
const log = console.log;

new ytdl.Download({v: 'NnTg4vzli5s'})
  .on('error', err => log('error', err))
  .on('succes', result => log('succes', result))
  .on('callMethod', method => log(`callMethod: ${method}`))
  .on('stream-progress', prog => log('stream-progress', prog))
  .on('conversion-progress', prog => log('conversion-progress', prog))
  .start();
});
