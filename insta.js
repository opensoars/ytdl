"use strict";

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  //'NnTg4vzli5s'
  //'sQVeK7Dt18U'
  'ynMPpTU_VuI'
];



vs.forEach(v => {
  let dl = new ytdl.Download({v, out: __dirname + '/done'});

  dl.on('error', (err) => {
    console.log('error', err);
    console.log(err.stack);
  });

  dl.on('success', (result) => {
    console.log('success', result);
  });

  dl.on('callMethod', (method) => {
    console.log('callMethod', method);
  });

  console.log('goin');

  dl.start();
});
