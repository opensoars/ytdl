"use strict";

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  '93zHY-gCvS8',
  // 'XcTHAJybjx4',
  // 'nj8t8SCx91g',
  // 'Me5GvbSHAFk',
  // '7FDGY0UCoTc',
  // 'hyR-m-ZAsCU',              
  // 'w5E1HIqSXdY'
];

vs.forEach(v => {
  let dl = new ytdl.Download({v});

  dl.on('error', (err) => {
    console.log('error', err);
  });

  dl.on('succes', (result) => {
    console.log('succes', result);
  });

  dl.start();
});
