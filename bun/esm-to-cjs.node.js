const fs = require('fs');
const { runTransform } = require("esm-to-cjs");
const { match } = require('assert');
// console.log('process.argv:%s', JSON.stringify(process.argv));

const filePath = process.argv[2];
// console.log('filePath:%s', filePath);

const fileContent = fs.readFileSync(filePath, 'utf-8');
// console.log('fileContent:%s', fileContent);

const result = runTransform(fileContent, filePath);
// console.log('result:%s', result);

const regex = /module\.exports = {(?:\s*(\w+),?\s*)+}/s;

const matches = result.match(regex);
matches.shift();
// console.log('matches:%s', JSON.stringify(matches, null, 4));

const replaceMent = matches.map(match => `exports.${match} = ${match};`).join('\n');
// console.log('replaceMent:%s', replaceMent);

const replaced = result.replace(regex, replaceMent);
// console.log('replaced:%s', replaced);

fs.writeFileSync(filePath, replaced, 'utf-8');
