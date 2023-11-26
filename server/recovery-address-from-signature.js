const {secp256k1} = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");


function recoverySenderAddress(sigHex, message, recoveryBit) {
  let signture = secp256k1.Signature.fromCompact(sigHex);
  signture = signture.addRecoveryBit(recoveryBit);

  const publicKey = signture.recoverPublicKey(keccak256(utf8ToBytes(message))).toRawBytes();
  const address = '0x'+toHex(keccak256(publicKey.slice(1)).slice(-20));
  return address;
}

exports.recoverySenderAddress = recoverySenderAddress;