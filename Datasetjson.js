const fs = require('fs');

let data = fs.readFileSync('DatasetClean_VendingMachine_Team1JKT.json', 'utf-8');
console.log(data);
let dataready = JSON.parse(data);
console.log(dataready);

