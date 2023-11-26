import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { recipientBalance, senderBalance, sender },
      } = await server.post(`send`, {
        amount: parseInt(sendAmount),
        recipient,
        signature,
        bit: parseInt(recoveryBit),
        timestamp : parseInt(timestamp),
      });
      if (address == recipient) setBalance(recipientBalance);
      if (address == sender) setBalance(senderBalance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder='Signed message {"recipient":"0x...","amount":1,"timestamp": 454...}'
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder="Recovery Bit you got when signing the message"
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Transfer Timestamp
        <input
          placeholder="Timestamp of Transfer Message"
          value={timestamp}
          onChange={setValue(setTimestamp)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
