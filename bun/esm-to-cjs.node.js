const fs = require('fs');
const { runTransform } = require("esm-to-cjs");
// console.log('process.argv:%s', JSON.stringify(process.argv));

const filePath = process.argv[2];
// console.log('filePath:%s', filePath);

const fileContent = fs.readFileSync(filePath, 'utf-8');
// console.log('fileContent:%s', fileContent);

const result = runTransform(fileContent, filePath);
// console.log('result:%s', result);

fs.writeFileSync(filePath, result, 'utf-8');
