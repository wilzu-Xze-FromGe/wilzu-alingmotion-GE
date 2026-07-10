const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const password = 'wilzu';
const inputFile = 'kontol.js';
const outputFile = 'kontol_hard.js';

if (!fs.existsSync(inputFile)) {
    console.error(' File kontol.js tidak ditemukan!');
    process.exit(1);
}

const source = fs.readFileSync(inputFile, 'utf8');
console.log(`[ > ] Source: ${source.length} karakter`);

let compressed = zlib.brotliCompressSync(Buffer.from(source, 'utf8'));
console.log(`[ © Copyright By wiLzu] Kompresi: ${compressed.length} bytes`);

const key = crypto.createHash('sha256').update(password).digest();
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = Buffer.concat([cipher.update(compressed), cipher.final()]);
const final = Buffer.concat([iv, encrypted]);
const b64 = final.toString('base64');
const chunkSize = 1200;
let chunks = [];
for (let i = 0; i < b64.length; i += chunkSize) {
    chunks.push(b64.slice(i, i + chunkSize));
}
const arrayString = `[${chunks.map(c => `"${c}"`).join(',')}]`;
const template = `(function(){const crypto=require('crypto');const zlib=require('zlib');const _enc=${arrayString}.join('');const _buf=Buffer.from(_enc,'base64');const _iv=_buf.slice(0,16);const _data=_buf.slice(16);const _key=crypto.createHash('sha256').update('wilzu').digest();const d=crypto.createDecipheriv('aes-256-cbc',_key,_iv);let _dec=d.update(_data);_dec=Buffer.concat([_dec,d.final()]);const _decomp=zlib.brotliDecompressSync(_dec);eval(_decomp.toString());})();`;
const minified = template.replace(/\s+/g, ' ');
fs.writeFileSync(outputFile, minified, 'utf8');
console.log(`Sukses: ${outputFile} dibuat`);
console.log(`Password: ${password}`);
console.log(`Jalankan: node ${outputFile}`);
