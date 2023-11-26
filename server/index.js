const express = require("express");
const app = express();
const cors = require("cors");
const { recoverySenderAddress } = require("./recovery-address-from-signature.js");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xad2512f4a6161f0519886be02f3bd1cce89eaa86": 100,
  "0x101b585db57efa2180e3f991661611d4a305464b": 50,
  "0x9b64cbc452ad91cc4e0a333a5bfd425d3a8a812e": 75,
};

const successTransferTimeStamps = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { amount, recipient, signature, bit, timestamp} = req.body;

  const msg = JSON.stringify({recipient, amount, timestamp});
  let sender;
  try {
    sender = recoverySenderAddress(signature, msg, bit);
  } catch (ex) {
    return res.status(400).send({ message: "Invalid data recieved!" });
  }

  if (checkTransferRepeat(sender, timestamp)) return res.status(400).send({ message: "This transfer has already been completed!" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) return res.status(400).send({ message: "Not enough funds!" });

  balances[sender] -= amount;
  balances[recipient] += amount;
  registerTransferTimestump(sender, timestamp);
  return res.send({ recipientBalance: balances[recipient], senderBalance: balances[sender], sender});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function checkTransferRepeat(senderAddress, timestamp) {
  return successTransferTimeStamps[senderAddress] && successTransferTimeStamps[senderAddress].includes(timestamp);
}

function registerTransferTimestump(senderAddress, timestamp) {
  if (!successTransferTimeStamps[senderAddress]) {
    successTransferTimeStamps[senderAddress] = [timestamp];
  } else {
    successTransferTimeStamps[senderAddress].push(timestamp);
  }
}