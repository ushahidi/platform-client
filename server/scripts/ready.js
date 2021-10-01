const address = require('address');
const colors = require('colors');

console.log("");
console.log("*****************");
console.log("");
console.log("All clients have loaded.".green);
console.log("");
console.log("Ushahidi client is ready to be viewed at", `http://${address.ip()}:9090`.blue);
console.log("");
console.log("*****************");
console.log("");
