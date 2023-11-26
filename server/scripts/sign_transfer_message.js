const prompt = require("prompt-sync")({ sigint: true });
const {secp256k1} = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const recipient = prompt("Type transfer recipient's address: ");
const amount = parseInt(prompt("Send Amount: "));
const privateKey = prompt("Your Private Key: ");

const d = new Date();
const timestamp = d.getTime();

const message = JSON.stringify({recipient, amount, timestamp});

const signature = secp256k1.sign(keccak256(utf8ToBytes(message)), privateKey);
console.log('Signature:', signature.toCompactHex());
console.log('Recovery Bit:', signature.recovery);
console.log('Transfer Timestamp:', timestamp);