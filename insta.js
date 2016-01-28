"use strict";

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  'NnTg4vzli5s',
];

vs.forEach(v => {
  let dl = new ytdl.Download({v, out: __dirname + '/done'});

  dl.on('error', (err) => {
    console.log('error', err);
  });

  dl.on('succes', (result) => {
    console.log('succes', result);
  });

  dl.start();
});
