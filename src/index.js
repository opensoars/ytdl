"use strict";

let p1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 1000);
  });
}

async function test() {
  let r1 = await p1();
  console.log(r1);
}

test();